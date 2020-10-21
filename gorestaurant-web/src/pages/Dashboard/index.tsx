import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      const foodsLoaded = await api.get<IFoodPlate[]>('/foods');

      setFoods(foodsLoaded.data);
    }

    loadFoods();
  }, []);

  async function handleAddFood({
    name,
    description,
    price,
    image
  }: Omit<IFoodPlate, 'id' | 'available'>): Promise<void> {
    try {
      const food = {
        name,
        description,
        price,
        image,
        available: true
      }

      const newFood = await api.post('/foods', {
        ...food
      });

      setFoods([
        ...foods,
        newFood.data
      ]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood({
    name,
    description,
    price,
    image
  }: Omit<IFoodPlate, 'id' | 'available'>): Promise<void> {
    try {
      const newFood = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        name,
        description,
        price,
        image
      });

      setFoods(
        foods.map(
          food => food.id === editingFood.id
            ? { ...newFood.data }
            : food
      )
      );
    } catch(error) {
      console.log(error);
    }
  }

  async function handleDeleteFood(id: number): Promise<void> {
    try {
      await api.delete(`/foods/${id}`);

      setFoods(
        foods.filter(food => food.id !== id)
      );
    } catch(error) {
      console.log(error);
    }
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    setEditingFood(food);
    
    toggleEditModal();
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
