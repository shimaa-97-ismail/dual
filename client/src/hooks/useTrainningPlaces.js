import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchTrainningPlaces,
  createTrainningPlace,
  updateTrainningPlace,
  deleteTrainningPlace,
  setCurrentTrainningPlace,
  clearCurrentTrainningPlace,
  resetOperationStatus,
} from '../store/slices/trainningPlace';

export const useTrainningPlaces = () => {
  const dispatch = useDispatch();
  const trainningPlacesState = useSelector((state) => state.trainningPlaces);

  // جلب جميع أماكن التدريب
  const getTrainningPlaces = useCallback(() => {
    dispatch(fetchTrainningPlaces());
  }, [dispatch]);

  // إنشاء مكان تدريب جديد
  const addTrainningPlace = useCallback(
    (trainningPlaceData) => {
      return dispatch(createTrainningPlace(trainningPlaceData));
    },
    [dispatch]
  );

  // تحديث مكان تدريب
  const editTrainningPlace = useCallback(
    (id, updatedData) => {
      return dispatch(updateTrainningPlace({ id, data: updatedData }));
    },
    [dispatch]
  );

  // حذف مكان تدريب
  const removeTrainningPlace = useCallback(
    (id) => {
      return dispatch(deleteTrainningPlace(id));
    },
    [dispatch]
  );

  // تعيين المكان الحالي للعرض/التعديل
  const selectTrainningPlace = useCallback(
    (trainningPlace) => {
      dispatch(setCurrentTrainningPlace(trainningPlace));
    },
    [dispatch]
  );

  // مسح المكان الحالي
  const deselectTrainningPlace = useCallback(() => {
    dispatch(clearCurrentTrainningPlace());
  }, [dispatch]);

  // إعادة تعيين حالة العمليات
  const resetStatus = useCallback(() => {
    dispatch(resetOperationStatus());
  }, [dispatch]);

  return {
    // الحالة
    ...trainningPlacesState,
    
    // الدوال
    getTrainningPlaces,
    addTrainningPlace,
    editTrainningPlace,
    removeTrainningPlace,
    selectTrainningPlace,
    deselectTrainningPlace,
    resetStatus,
    
    // حالات التحميل المحددة
    isLoading: trainningPlacesState.status === 'loading',
    isCreating: trainningPlacesState.operationStatus.create === 'loading',
    isUpdating: trainningPlacesState.operationStatus.update === 'loading',
    isDeleting: trainningPlacesState.operationStatus.delete === 'loading',
    
    // حالات النجاح
    createSuccess: trainningPlacesState.operationStatus.create === 'succeeded',
    updateSuccess: trainningPlacesState.operationStatus.update === 'succeeded',
    deleteSuccess: trainningPlacesState.operationStatus.delete === 'succeeded',
    
    // حالات الفشل
    createError: trainningPlacesState.operationStatus.create === 'failed',
    updateError: trainningPlacesState.operationStatus.update === 'failed',
    deleteError: trainningPlacesState.operationStatus.delete === 'failed',
  };
};