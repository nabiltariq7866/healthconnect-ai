import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CustomSelect } from '../components/UI'

describe('CustomSelect', () => {
  it('uses an accessible custom combobox instead of a native HTML select', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { container } = render(<CustomSelect ariaLabel="Test role" value="Data Steward" onChange={onChange} options={[{ value: 'Data Steward', label: 'Data Steward' }, { value: 'Clinician', label: 'Clinician' }]} />)
    expect(container.querySelector('select')).toBeNull()
    const trigger = screen.getByRole('combobox', { name: 'Test role' })
    await user.click(trigger)
    await user.click(screen.getByRole('option', { name: 'Clinician' }))
    expect(onChange).toHaveBeenCalledWith('Clinician')
  })

  it('supports keyboard opening and selection', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<CustomSelect ariaLabel="Status filter" value="All" onChange={onChange} options={[{ value: 'All', label: 'All' }, { value: 'Open', label: 'Open' }]} />)
    const trigger = screen.getByRole('combobox', { name: 'Status filter' })
    trigger.focus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('listbox')).toBeVisible()
    await user.keyboard('{ArrowDown}{Enter}')
    expect(onChange).toHaveBeenCalledWith('Open')
  })
})
