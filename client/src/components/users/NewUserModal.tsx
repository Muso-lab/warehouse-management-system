import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { User } from '../../types/user';

interface NewUserModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (userData: Omit<User, '_id'>) => void;
  editUser?: User;
}

const initialUserData = {
  username: '',
  password: '',
  role: 'ufficio' as User['role'],
  active: true,
};

const NewUserModal: React.FC<NewUserModalProps> = ({ open, onClose, onSave, editUser }) => {
  const [userData, setUserData] = useState<Omit<User, '_id'>>(initialUserData);

  useEffect(() => {
    if (editUser) {
      setUserData({
        username: editUser.username,
        password: '', // Non mostriamo la password esistente
        role: editUser.role,
        active: editUser.active,
      });
    } else {
      setUserData(initialUserData);
    }
  }, [editUser, open]); // Aggiungiamo open come dipendenza

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(userData);
  };

  const handleClose = () => {
    setUserData(initialUserData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {editUser ? 'Modifica Utente' : 'Nuovo Utente'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome Utente"
            fullWidth
            value={userData.username}
            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            required={!editUser}
            helperText={editUser ? "Lascia vuoto per mantenere la password esistente" : ""}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Ruolo</InputLabel>
            <Select
              value={userData.role}
              label="Ruolo"
              onChange={(e) => setUserData({ ...userData, role: e.target.value as User['role'] })}
            >
              <MenuItem value="admin">Amministratore</MenuItem>
              <MenuItem value="ufficio">Ufficio</MenuItem>
              <MenuItem value="magazzino">Magazzino</MenuItem>
              <MenuItem value="monitor">Monitor</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={userData.active}
                onChange={(e) => setUserData({ ...userData, active: e.target.checked })}
              />
            }
            label="Utente attivo"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annulla</Button>
          <Button type="submit" variant="contained">
            {editUser ? 'Salva modifiche' : 'Crea utente'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NewUserModal;
