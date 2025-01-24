import { Box, Paper, Button, Alert, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import OperatorTable from '../components/operators/OperatorTable';
import NewOperatorModal from '../components/operators/NewOperatorModal';
import { Operator } from '../types/operator';
import { operatorService } from '../services/operatorService';

const Operators = () => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOperator, setEditingOperator] = useState<Operator | null>(null);

  useEffect(() => {
    loadOperators();
  }, []);

  const loadOperators = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await operatorService.getAllOperators();
      setOperators(data);
    } catch (err) {
      setError('Errore nel caricamento degli operatori');
      console.error('Error loading operators:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveOperator = async (operatorData: Omit<Operator, '_id'>) => {
    try {
      setIsLoading(true);
      setError(null);

      if (editingOperator) {
        const updatedOperator = await operatorService.updateOperator(editingOperator._id!, operatorData);
        setOperators(prevOperators =>
          prevOperators.map(op =>
            op._id === updatedOperator._id ? updatedOperator : op
          )
        );
      } else {
        const newOperator = await operatorService.createOperator(operatorData);
        setOperators(prevOperators => [...prevOperators, newOperator]);
      }

      setIsModalOpen(false);
      setEditingOperator(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Errore nel salvataggio dell\'operatore');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOperator = async (operatorId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await operatorService.deleteOperator(operatorId);
      setOperators(prevOperators =>
        prevOperators.filter(op => op._id !== operatorId)
      );
    } catch (err) {
      setError('Errore nell\'eliminazione dell\'operatore');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer title="Gestione Operatori">
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
          disabled={isLoading}
        >
          Nuovo Operatore
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%', position: 'relative' }}>
        {isLoading && (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 1
          }}>
            <CircularProgress />
          </Box>
        )}
        <OperatorTable
          operators={operators}
          onDeleteOperator={handleDeleteOperator}
          onEditOperator={setEditingOperator}
        />
      </Paper>

      <NewOperatorModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingOperator(null);
        }}
        onSave={handleSaveOperator}
        editOperator={editingOperator}
      />
    </PageContainer>
  );
};

export default Operators;
