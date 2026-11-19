import { act, cleanup, render, screen } from '@testing-library/react';
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
  expect(screen.getByText('70% كحد أقصى', { selector: 'dd' })).toBeInTheDocument();
  expect(screen.getByText('75% كحد أقصى')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'عرض المصدر الثاني' })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'رسالتك للمساعد' })).toBeEnabled();
  view.rerender(<Assistant {...props} active selectionId="725:villa" onRetrieve={() => onRetrieve()} />);
  act(() => vi.advanceTimersByTime(4000));
  expect(onRetrieve).toHaveBeenCalledTimes(1);
});