import StyledButton from '@/components/ui/button';
import {
  DateRangePickerDialog,
  type DateRangeSelection,
  Host,
} from '@expo/ui/jetpack-compose';
import { useEffect, useState } from 'react';
import { useStatsCtx } from './context/statsCtxProvider';

export default function DateRangePickerDialogExample() {
  const [visible, setVisible] = useState(false);
  const [range, setRange] = useState<DateRangeSelection>({
    start: new Date(new Date().getFullYear(), 0, 1, 1),
    end: new Date(new Date(new Date().getFullYear() + 1, 0, 1).getTime() - 24 * 60 * 60 * 1000),
  });

  const { loading, setStartDate, setEndDate} = useStatsCtx()

  useEffect(() => {
    if (range.start && range.end) {
      setStartDate(range.start)
      setEndDate(range.end)
    }
  }, [])

  useEffect(() => {
    if (range.start && range.end) {
      setStartDate(range.start)
      setEndDate(range.end)
    }
  }, [range])

  return (
    <>
      <StyledButton text='Select date' onClick={() => setVisible(true)} type='primary' disable={loading} />
      {visible && (
        <Host>
          <DateRangePickerDialog
            initialStartDate={range.start?.toISOString()}
            initialEndDate={range.end?.toISOString()}
            onDateRangeSelected={selectedRange => {
              setRange(selectedRange);
              setVisible(false);
            }}
            onDismissRequest={() => setVisible(false)}
            selectableDates={{
              end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
            }}
          />
        </Host>
      )}
    </>
  );
}
