import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchHighlight'
})
export class SearchHighlightPipe implements PipeTransform {

  transform(value: string | string[], ...args: any): string | string[]{
    // search bar switches between string that only contains current input
      // and array that contains all chips
    if (typeof value === "object"
      && value instanceof Array<string>)
      return value
    if (!args) {
      return value;
    }
    const regex = new RegExp(args, 'gi');
    const match = value.match(regex);
    if (!match) {
      return value;
    }
    return value.replace(regex, `<span class="highlighted">${match[0]}</span>`)
  }

}
