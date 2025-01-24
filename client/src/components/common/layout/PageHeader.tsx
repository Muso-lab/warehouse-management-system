// client/src/components/common/layout/PageHeader.tsx
import React from 'react';
import {
  Box,
  ButtonGroup,
  Button,
  Typography,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
} from '@mui/icons-material';
import { format, addDays, subDays } from 'date-fns';
import { it } from 'date-fns/locale';

interface PageHeaderProps {
  title: string;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  showDateSelector?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  selectedDate,
  onDateChange,
  showDateSelector = true
}) => {
  const handlePreviousDay = () => {
    onDateChange(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    onDateChange(addDays(selectedDate, 1));
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        pl: 2,
        pr: 2,
        mt: 2,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          fontSize: '2rem',
          color: theme => theme.palette.primary.main,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          display: 'block',
          width: 'auto',
          position: 'relative',
          zIndex: 1
        }}
      >
        {title}
      </Typography>

      {showDateSelector && (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          ml: 'auto'
        }}>
          <ButtonGroup variant="contained" size="small">
            <Button onClick={handlePreviousDay}>
              <ChevronLeftIcon />
            </Button>
            <Button onClick={handleToday} startIcon={<TodayIcon />}>
              Oggi
            </Button>
            <Button onClick={handleNextDay}>
              <ChevronRightIcon />
            </Button>
          </ButtonGroup>
          <Typography variant="h6">
            {format(selectedDate, 'EEEE d MMMM yyyy', { locale: it })}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PageHeader;
