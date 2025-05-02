import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { fetchAllCategories, deleteCategory } from '../../store/categorySlice';
import { RootState } from '../../store';
import { AppDispatch } from '../../store';
import { CategoryDto } from '../../types';
import CategoryDialog from './CategoryDialog';
import ConfirmDialog from '../common/ConfirmDialog';

const CategoryList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading, error } = useSelector((state: RootState) => state.categories);
  
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<CategoryDto | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  
  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);
  
  const handleAddCategory = () => {
    setCurrentCategory(null);
    setOpenCategoryDialog(true);
  };
  
  const handleEditCategory = (category: CategoryDto) => {
    setCurrentCategory(category);
    setOpenCategoryDialog(true);
  };
  
  const handleCategoryDialogClose = () => {
    setOpenCategoryDialog(false);
    setCurrentCategory(null);
  };
  
  const handleCategorySaved = () => {
    setOpenCategoryDialog(false);
    setCurrentCategory(null);
    dispatch(fetchAllCategories());
  };
  
  const handleDeleteClick = (categoryId: number) => {
    setCategoryToDelete(categoryId);
    setDeleteConfirmOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      dispatch(deleteCategory(categoryToDelete))
        .unwrap()
        .then(() => {
          dispatch(fetchAllCategories());
        });
    }
    setDeleteConfirmOpen(false);
    setCategoryToDelete(null);
  };
  
  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setCategoryToDelete(null);
  };
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Categories</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddCategory}
        >
          Add Category
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {categories.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No categories found. Create a new category to organize your tasks.
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={2} direction="row" flexWrap="wrap" useFlexGap>
              {categories.map((category) => (
                <Card key={category.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.33% - 10.67px)' }, height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CategoryIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6" component="div">
                          {category.name}
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditCategory(category)}
                          aria-label="edit"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => category.id && handleDeleteClick(category.id)}
                          aria-label="delete"
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                      {category.description || 'No description'}
                    </Typography>
                    
                    <Chip 
                      label={`${category.taskCount || 0} tasks`} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </>
      )}
      
      <CategoryDialog
        open={openCategoryDialog}
        onClose={handleCategoryDialogClose}
        category={currentCategory}
        onSave={handleCategorySaved}
      />
      
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Category"
        content="Are you sure you want to delete this category? Tasks associated with this category will not be deleted, but they will no longer be categorized."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Box>
  );
};

export default CategoryList;
