import { parseOneAddress } from 'email-addresses'
import { isCompanyDomain } from 'company-email-validator'

export class EmailValidationService {
  validateEmail(email: string) {
    return Boolean(parseOneAddress(email))
  }

  async disposable(email: string) {
    const domain = this.getEmailDomain(email)
    const list = await this.getDisposableDomainsList()

    if (!domain)
      return 'unknown' as const

    if (!list)
      return 'unknown' as const

    return list.includes(domain)
  }

  async corporate(email: string) {
    const domain = this.getEmailDomain(email)

    if (!domain)
      return 'unknown' as const

    return isCompanyDomain(domain)
  }

  /**
   * @todo Cache results
   */
  private async getDisposableDomainsList() {
    try {
      const resp = await fetch('https://disposable.github.io/disposable-email-domains/domains.json')
      const list = await resp.json() as Awaited<string[]>
  
      return list
    } catch (e) {
      console.error(e)

      return null
    }
  }

  private getEmailDomain(email: string) {
    const parsedEmail = parseOneAddress(email)

    if (!parsedEmail)
      return null

    if ('domain' in parsedEmail) {
      return parsedEmail.domain ?? null
    }

    return null
  }
}
