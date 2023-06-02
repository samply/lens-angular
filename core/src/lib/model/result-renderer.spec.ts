import { ResultRendererComponent } from '../components/result-renderer.component';
import { ResultRenderer } from './result-renderer';

describe('ResultRenderer', () => {
  it('should create an instance', () => {
    expect(new ResultRenderer(
      "Some Bar",
      [{key: "Identifier"}],
      ResultRendererComponent
    )).toBeTruthy();
  });
});
