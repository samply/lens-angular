import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchHighlight'
})
export class SearchHighlightPipe implements PipeTransform {

  transform(value: string, ...args: any): string{
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
