import { promisify } from 'node:util'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { gunzip as baseUnzip } from 'node:zlib'
import { execSync } from 'node:child_process'
import { mkdirpSync } from 'mkdirp'

const unzip = promisify(baseUnzip)

export class DockhostInstaller {
  private downloadDir = path.join(__dirname, 'downloads')
  public executableFilename = path.join(this.downloadDir, 'dockhost')

  public async install() {
    mkdirpSync(this.downloadDir)

    await this.downloadDockhostCli()
  }

  private async downloadDockhostCli() {
    const target = this.getDockhostTarget()

    if (target == null)
      return null

    execSync(`curl --fail --location --output "${this.executableFilename}.zip" "https://download.dockhost.ru/cli/releases/latest/${target}.zip"`)

    execSync(`unzip -oq ${this.executableFilename}.zip -d ${path.dirname(this.executableFilename)}`)
  }

  private getDockhostTarget() {
    switch (`${process.platform}:${process.arch}`) {
      case 'darwin:arm64':
        return 'dockhost_aarch64-apple-darwin'
      case 'linux:x64':
        return 'dockhost_x86_64-linux'
      default:
        return null
    }
  }
}
