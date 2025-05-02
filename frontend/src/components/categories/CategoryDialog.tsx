import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import { createCategory, updateCategory } from '../../store/categorySlice';
import { RootState } from '../../store';
import { AppDispatch } from '../../store';
import { CategoryDto } from '../../types';

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  category: CategoryDto | null;
  onSave: () => void;
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({ open, onClose, category, onSave }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.categories);
  
  const formik = useFormik({
    initialValues: {
      name: category?.name || '',
      description: category?.description || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      description: Yup.string(),
    }),
    onSubmit: (values) => {
      const categoryData: CategoryDto = {
        ...values,
      };
      
      if (category?.id) {
        dispatch(updateCategory({ id: category.id, category: categoryData }))
          .unwrap()
          .then(() => {
            onSave();
          });
      } else {
        dispatch(createCategory(categoryData))
          .unwrap()
          .then(() => {
            onSave();
          });
      }
    },
    enableReinitialize: true,
  });
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{category ? 'Edit Category' : 'Create New Category'}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            margin="normal"
          />
          
          <TextField
            fullWidth
            id="description"
            name="description"
            label="Description"
            multiline
            rows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {category ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CategoryDialog;
