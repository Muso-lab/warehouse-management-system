import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Operator } from '../../types/operator';

interface NewOperatorModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (operatorData: Omit<Operator, '_id'>) => void;
  editOperator: Operator | null;
}

const NewOperatorModal: React.FC<NewOperatorModalProps> = ({
  open,
  onClose,
  onSave,
  editOperator,
}) => {
  const [formData, setFormData] = useState<Omit<Operator, '_id'>>({
    name: '',
    active: true,
  });

  const [nameError, setNameError] = useState<string>('');

  useEffect(() => {
    if (editOperator) {
      setFormData({
        name: editOperator.name,
        active: editOperator.active,
      });
    } else {
      setFormData({
        name: '',
        active: true,
      });
    }
    setNameError('');
  }, [editOperator, open]);

  const validateForm = (): boolean => {
    let isValid = true;
    setNameError('');

    if (!formData.name.trim()) {
      setNameError('Il nome è obbligatorio');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleClose = () => {
    setNameError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {editOperator ? 'Modifica Operatore' : 'Nuovo Operatore'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome Operatore"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (nameError) setNameError('');
                }}
                error={!!nameError}
                helperText={nameError}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  />
                }
                label="Operatore attivo"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annulla</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!formData.name.trim()}
          >
            {editOperator ? 'Salva modifiche' : 'Crea operatore'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NewOperatorModal;
