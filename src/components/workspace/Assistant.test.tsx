import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { Assistant } from './Assistant';

afterEach(() => { cleanup(); vi.useRealTimers(); });
it('automatically reports requirements and conflicts once, then accepts follow-up input', () => {
  vi.useFakeTimers();
  const onRetrieve = vi.fn();
  const props = { active: false, selectionId: null as string | null, onRetrieve, onOpen3D: vi.fn(), onSource: vi.fn() };
  const view = render(<Assistant {...props} />);
  act(() => vi.advanceTimersByTime(4000));
  expect(onRetrieve).not.toHaveBeenCalled();
  view.rerender(<Assistant {...props} active selectionId="725:villa" />);
  act(() => vi.advanceTimersByTime(4000));
  expect(onRetrieve).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('log').textContent).toContain('70%');
  expect(screen.getByRole('log').textContent).toContain('75%');
  fireEvent.click(screen.getAllByRole('button', { name: 'المصدر 2، صفحة 18' })[0] as HTMLElement);
  expect(props.onSource).toHaveBeenCalledWith({ documentId: 'residential', page: 18 });
  fireEvent.click(screen.getByRole('button', { name: 'تكبير المساعد' }));
  fireEvent.click(screen.getByRole('button', { name: 'استعادة المساعد' }));
  expect(screen.getByRole('textbox', { name: 'رسالتك للمساعد' })).toBeEnabled();
  view.rerender(<Assistant {...props} active selectionId="725:villa" onRetrieve={() => onRetrieve()} />);
  act(() => vi.advanceTimersByTime(4000));
  expect(onRetrieve).toHaveBeenCalledTimes(1);
});
it('reports uploaded files as unsupported and demo plans as an independent scenario', () => {
  const props = { active: true, selectionId: null, onRetrieve: vi.fn(), onOpen3D: vi.fn(), onSource: vi.fn() };
  const view = render(<Assistant {...props} planEvent={{ id: 1, supported: false }} />);
  expect(screen.getByRole('log').textContent).toContain('لا يدعم العرض التجريبي تحليل محتوى الملفات العشوائية');
  view.rerender(<Assistant {...props} planEvent={{ id: 2, supported: true }} />);
  expect(screen.getByRole('log').textContent).toContain('مخالفتان توضيحيتان');
});