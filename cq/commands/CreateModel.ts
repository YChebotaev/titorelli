import { ModelModel } from '@titorelli/persistence'
import type { ICommand } from '../lib'

export type CreateModelProps = {

}

export class CreateModelCommand implements ICommand<CreateModelProps> {
  async execute({ }: CreateModelProps): Promise<void> {
    await ModelModel.query().insert({

    })
  }
}
