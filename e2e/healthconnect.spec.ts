import { test, expect, type Page } from '@playwright/test'

async function chooseCustomOption(page: Page, label: string, option: string) {
  await page.getByRole('combobox', { name: label }).click()
  await page.getByRole('option').filter({ hasText: option }).first().click()
}

async function chooseRole(page: Page, role: string) {
  await chooseCustomOption(page, 'Current role', role)
}

test.beforeEach(async ({ page }) => {
  await page.goto('/settings')
  await page.getByRole('button', { name: /Reset HealthConnect Demo/i }).click()
  await page.getByRole('dialog').getByRole('button', { name: /Reset demo/i }).click()
})

test('identity merge updates Patient 360, preserves source IDs and exposes provenance', async ({ page }) => {
  await page.goto('/identity')
  const emilyRow = page.getByRole('row').filter({ hasText: 'Emily Robertson' })
  await emilyRow.getByRole('button', { name: 'Review' }).click()
  await expect(page.getByRole('dialog')).toContainText('Date of birth')
  await expect(page.getByRole('dialog')).toContainText('Address')
  await page.getByRole('button', { name: /Merge records/i }).click()
  const confirmation = page.getByRole('dialog', { name: /Confirm identity merge/i })
  await confirmation.getByLabel(/Type MERGE/i).fill('MERGE')
  await confirmation.getByRole('button', { name: /Confirm decision/i }).click()

  await page.goto('/patients/pt-emily')
  await expect(page.getByText('CityCare Oracle Health').first()).toBeVisible()
  await expect(page.getByText(/Metformin frequency differs across sources/i)).toBeVisible()
  await page.getByRole('tab', { name: 'Sources' }).click()
  await expect(page.getByText('ORC-201839')).toBeVisible()

  await page.getByRole('tab', { name: 'Imaging' }).click()
  const ctCard = page.getByText('CT chest').first().locator('..')
  await page.getByRole('button', { name: /View source/i }).first().click()
  await expect(page.getByRole('dialog')).toContainText('PACS-STUDY-39011')
  await expect(page.getByRole('dialog')).toContainText('Prime Imaging Centre')
  await page.getByRole('dialog').getByRole('button', { name: /Close drawer/i }).click()
})

test('laboratory interface failure produces freshness warning then clears only after recovery sync', async ({ page }) => {
  await chooseRole(page, 'Integration Engineer')
  await page.goto('/interfaces')
  const labRow = page.getByRole('row').filter({ hasText: 'Metro Diagnostics ORU' })
  await labRow.getByRole('button', { name: 'Manage' }).click()
  await page.getByRole('button', { name: /Create demo error/i }).click()

  await page.goto('/patients/pt-emily')
  await expect(page.getByText(/Data freshness warning/i)).toBeVisible()

  await page.goto('/interfaces')
  await page.getByRole('row').filter({ hasText: 'Metro Diagnostics ORU' }).getByRole('button', { name: 'Manage' }).click()
  await page.getByRole('button', { name: /Restore connection/i }).click()
  await page.getByRole('button', { name: /Simulate sync/i }).click()
  await page.goto('/patients/pt-emily')
  await expect(page.getByText(/Data freshness warning/i)).toHaveCount(0)
  await page.getByRole('tab', { name: 'Laboratory' }).click()
  await expect(page.getByText('C-reactive protein')).toBeVisible()
})

test('new unmatched laboratory record stays out of Patient 360 until Data Steward links it', async ({ page }) => {
  await page.goto('/data-quality')
  await page.getByRole('button', { name: /Create demo incoming lab/i }).click()
  const card = page.locator('.unmatched-card').filter({ hasText: 'NT-proBNP' })
  await expect(card).toBeVisible()
  await card.getByRole('button', { name: /Review matches/i }).click()
  await chooseCustomOption(page, 'Patient for unmatched record', 'Emily Robinson · HC-2026-102842')
  await page.getByRole('dialog').getByRole('button', { name: /Link to Patient 360/i }).click()

  await page.goto('/patients/pt-emily')
  await page.getByRole('tab', { name: 'Laboratory' }).click()
  await expect(page.getByText('NT-proBNP')).toBeVisible()
  await page.goto('/audit')
  await expect(page.getByText('Unmatched record linked').first()).toBeVisible()
})

test('Copilot answer exposes clickable exact source citation and no native role select', async ({ page }) => {
  await chooseRole(page, 'Clinician')
  await page.goto('/copilot')
  await expect(page.locator('select')).toHaveCount(0)
  await page.getByRole('button', { name: /Generate source-grounded answer/i }).click()
  const citation = page.locator('.citations button').first()
  await expect(citation).toBeVisible()
  await citation.click()
  await expect(page.getByRole('dialog')).toContainText('Original record')
  await expect(page.getByRole('dialog')).toContainText('Clinical time')
  await expect(page.getByRole('dialog')).toContainText('Received')
})

test('message repair blocks retry until identifier issue is resolved', async ({ page }) => {
  await chooseRole(page, 'Integration Engineer')
  await page.goto('/messages')
  const failedRow = page.getByRole('row').filter({ hasText: 'MSG-20260814-FAIL01' })
  await failedRow.getByRole('button', { name: 'Inspect' }).click()
  await expect(page.getByRole('button', { name: /Retry processing/i })).toBeDisabled()
  await page.getByRole('button', { name: /Resolve demo identifier/i }).click()
  await page.getByRole('button', { name: /Retry processing/i }).click()
  await expect(page.getByRole('dialog')).toContainText('Processed')
})

test('custom role dropdown is keyboard accessible', async ({ page }) => {
  const role = page.getByRole('combobox', { name: 'Current role' })
  await role.focus()
  await role.press('ArrowDown')
  await expect(page.getByRole('listbox')).toBeVisible()
  await page.getByRole('option', { name: 'Clinician', exact: true }).click()
  await expect(role).toContainText('Clinician')
})
