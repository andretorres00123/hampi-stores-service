import { Guard } from '../helpers/core/Guard'
import { Result } from '../helpers/core/Result'
import { ValueObject } from './common/ValueObject'

export interface CategoryProps {
  name: string
}

export class Category extends ValueObject<CategoryProps> {
  get name(): string {
    return this.props.name
  }

  static create(props: CategoryProps): Result<Category> {
    let guardResult = Guard.againstNullOrUndefined(props.name, 'name')
    if (!guardResult.succeeded) {
      return Result.fail<Category>(guardResult.message as string)
    }

    guardResult = Guard.againstEmptyString(props.name, 'name')
    if (!guardResult.succeeded) {
      return Result.fail<Category>(guardResult.message as string)
    }

    return Result.ok(new Category(props))
  }
}
