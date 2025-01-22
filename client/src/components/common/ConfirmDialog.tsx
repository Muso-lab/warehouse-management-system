import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  error?: boolean;
}

const ConfirmDialog = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  error = false
}: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {message}
          </Alert>
        ) : (
          <Typography>{message}</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Annulla</Button>
        <Button
          onClick={onConfirm}
          color={error ? "primary" : "error"}
          variant="contained"
        >
          {error ? "Riprova" : "Conferma"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
