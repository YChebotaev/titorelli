import { execFile as baseExecFile } from 'node:child_process'
import { promisify } from 'node:util'
import { DockhostInstaller } from "./DockhostInstaller"

const execFile = promisify(baseExecFile)

export class DockhostService {
  private installer = new DockhostInstaller()
  private ready: Promise<void>

  constructor(
    private token: string
  ) {
    this.ready = this.initialize()
  }

  public async createContainer({
    name,
    image,
    uid,
    gid,
    replicas,
    cpu,
    cpuFraction,
    memory,
    port,
    init,
    variable = {},
    config = {},
    volume = {},
    project
  }: {
    name: string
    image: string
    uid?: number
    gid?: number
    replicas?: number
    cpu?: number
    cpuFraction?: 5 | 10 | 20 | 50 | 80 | 100
    memory?: number
    port?: number | number[]
    init?: string | string[]
    variable?: Record<string, string>
    config?: Record<string, string>
    volume?: Record<string, string>
    project?: string
  }) {
    await this.ready

    const args: string[] = []

    args.push(`--name ${name}`)
    args.push(`--image ${image}`)

    if (uid)
      args.push(`--uid ${uid}`)

    if (gid)
      args.push(`--gid ${gid}`)

    if (replicas != null)
      args.push(`--replicas ${replicas}`)

    if (cpu != null)
      args.push(`--cpu ${cpu}`)

    if (cpuFraction != null)
      args.push(`--cpu-fraction ${cpuFraction}`)

    if (memory)
      args.push(`--memory ${memory}`)

    if (port) {
      if (Array.isArray(port)) {
        for (const p of port) {
          args.push(`--port ${p}`)
        }
      } else {
        args.push(`--port ${port}`)
      }
    }

    if (init) {
      if (Array.isArray(init)) {
        for (const i of init) {
          args.push(`--init ${i}`)
        }
      } else {
        args.push(`--init ${init}`)
      }
    }

    for (const [name, value] of Object.entries(variable)) {
      args.push(`--variable ${name}:${value}`)
    }

    for (const [name, value] of Object.entries(config)) {
      args.push(`--config ${name}:${value}`)
    }

    for (const [name, value] of Object.entries(volume)) {
      args.push(`--volume ${name}:${value}`)
    }

    if (project)
      args.push(`--project ${project}`)

    return this.exec('container', 'create', ...args)
  }

  public async deleteContainer(project: string, name: string) {
    await this.ready

    return this.exec('container', 'delete', `--name ${name} --project ${project}`)
  }

  public async listContainer(project: string) {
    await this.ready

    return this.exec('container', 'list', `--project ${project}`)
  }

  public async startContainer(project: string, name: string) {
    await this.ready

    return this.exec('container', 'start', name, `--project ${project}`)
  }

  public async stopContainer(project: string, name: string) {
    await this.ready

    return this.exec('container', 'stop', name, `--project ${project}`)
  }

  private async exec(...args: string[]) {
    const { stdout, stderr } = await execFile(this.installer.executableFilename, args, {
      encoding: 'utf-8',
      env: {
        DOCKHOST_TOKEN: this.token
      }
    })

    if (stderr)
      throw new Error(stderr)

    return stdout
  }

  private async initialize() {
    await this.installer.install()
  }
}
