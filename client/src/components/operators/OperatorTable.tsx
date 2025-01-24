import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip,
  TablePagination,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useState } from 'react';
import { Operator } from '../../types/operator';
import { format } from 'date-fns';

interface OperatorTableProps {
  operators: Operator[];
  onEditOperator: (operator: Operator) => void;
  onDeleteOperator: (operatorId: string) => void;
}

const OperatorTable: React.FC<OperatorTableProps> = ({
  operators,
  onEditOperator,
  onDeleteOperator,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (operator: Operator) => {
    if (window.confirm(`Sei sicuro di voler eliminare l'operatore ${operator.name}?`)) {
      onDeleteOperator(operator._id!);
    }
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome Operatore</TableCell>
              <TableCell>Stato</TableCell>
              <TableCell>Data Creazione</TableCell>
              <TableCell align="right">Azioni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {operators
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((operator) => (
                <TableRow key={operator._id}>
                  <TableCell>{operator.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={operator.active ? 'Attivo' : 'Inattivo'}
                      color={operator.active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {operator.createdAt
                      ? format(new Date(operator.createdAt), 'dd/MM/yyyy')
                      : '-'}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Modifica">
                      <IconButton
                        size="small"
                        onClick={() => onEditOperator(operator)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Elimina">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(operator)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={operators.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Righe per pagina:"
      />
    </>
  );
};

export default OperatorTable;
