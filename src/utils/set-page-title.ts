import { appName } from '@/constants'
import { i18n } from '@/utils/i18n'

export default function setPageTitle(name?: string): void {
  if (name) {
    const translation = i18n.global.t(`navbar.${name}`)
    const title = translation === `navbar.${name}` ? name : translation
    window.document.title = `${title} - ${appName()}`
  }
  else {
    window.document.title = appName()
  }
}
