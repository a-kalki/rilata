import { ValidationRule } from '../validation-rule.ts';
import { TypeOrAssertRuleAnswer } from '../types.ts';
import { AssertionException } from '../../../../core/exeptions.ts';

export class MinArrayElementsCountAssertionRule extends ValidationRule<'assert', unknown> {
  requirement = 'Минимальное количество элементов может быть {{min}}, сейчас {{currentCount}}';

  constructor(private minElementsCount: number) {
    super();
    if (minElementsCount < 0) throw new AssertionException(`invalid counts: ${minElementsCount}`);
  }

  validate(value: unknown[]): TypeOrAssertRuleAnswer {
    return value.length < this.minElementsCount
      ? this.returnFail('SaveErrorAndBreakValidation', { min: this.minElementsCount, currentCount: value.length })
      : this.returnSuccess('SuccessRunNextRule');
  }
}
