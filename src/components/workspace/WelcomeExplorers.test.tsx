import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { BenefitComparison, StepExplorer } from './WelcomeExplorers';

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); });

it('advances a step every four seconds until a step is clicked', () => {
  vi.useFakeTimers();
  render(<StepExplorer />);
  expect(screen.getByRole('tab', { name: /اختر أرضك/ })).toHaveAttribute('aria-selected', 'true');
  act(() => vi.advanceTimersByTime(3999));
  expect(screen.getByRole('tab', { name: /اختر أرضك/ })).toHaveAttribute('aria-selected', 'true');
  act(() => vi.advanceTimersByTime(1));
  expect(screen.getByRole('tab', { name: /اعرف اشتراطاتها/ })).toHaveAttribute('aria-selected', 'true');
  fireEvent.click(screen.getByRole('tab', { name: /صمّم وراجِع/ }));
  act(() => vi.advanceTimersByTime(8000));
  expect(screen.getByRole('tab', { name: /صمّم وراجِع/ })).toHaveAttribute('aria-selected', 'true');
});

it('activates a hovered step immediately and pauses automatic changes', () => {
  vi.useFakeTimers();
  render(<StepExplorer />);
  fireEvent.mouseEnter(screen.getByRole('tab', { name: /شاهد الحجم المسموح/ }));
  expect(screen.getByRole('tab', { name: /شاهد الحجم المسموح/ })).toHaveAttribute('aria-selected', 'true');
  act(() => vi.advanceTimersByTime(8000));
  expect(screen.getByRole('tab', { name: /شاهد الحجم المسموح/ })).toHaveAttribute('aria-selected', 'true');
});
it('shows only the "with Bunyan" benefits with no comparison toggle', () => {
  render(<BenefitComparison />);
  expect(screen.getByText('دقائق')).toBeInTheDocument();
  expect(screen.getByText('تكلفة أقل من البداية')).toBeInTheDocument();
  expect(screen.getByText('تُكتشف قبل التقديم')).toBeInTheDocument();
  expect(screen.queryByText('بدون بنيان')).not.toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});
