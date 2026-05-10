import { describe, it, expect } from 'vitest'
import { calculateDistribution } from './financial-logic'

describe('calculateDistribution', () => {
  it('correctly distributes 1000 THB across 6 jars', () => {
    const amount = 1000
    const result = calculateDistribution(amount)

    const nec = result.find(r => r.name === 'NEC')
    const ffa = result.find(r => r.name === 'FFA')
    const lts = result.find(r => r.name === 'LTS')
    const edu = result.find(r => r.name === 'EDU')
    const ply = result.find(r => r.name === 'PLY')
    const giv = result.find(r => r.name === 'GIV')

    expect(nec?.value).toBe('550.00')
    expect(ffa?.value).toBe('100.00')
    expect(lts?.value).toBe('100.00')
    expect(edu?.value).toBe('100.00')
    expect(ply?.value).toBe('100.00')
    expect(giv?.value).toBe('50.00')

    // Verify sum equals original amount
    const sum = result.reduce((acc, curr) => acc + parseFloat(curr.value), 0)
    expect(sum).toBe(1000)
  })

  it('handles edge cases like zero amount', () => {
    const result = calculateDistribution(0)
    result.forEach(jar => {
      expect(jar.value).toBe('0.00')
    })
  })

  it('handles irregular amounts with precision', () => {
    // 1234.56
    // NEC: 679.008 -> 679.01
    // PLY: 123.456 -> 123.46
    const result = calculateDistribution('1234.56')
    const nec = result.find(r => r.name === 'NEC')
    expect(nec?.value).toBe('679.01')
  })
})
