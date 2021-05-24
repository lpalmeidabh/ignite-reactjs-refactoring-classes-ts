import { useState, useEffect } from "react";

import Header from "../../components/Header";
import api from "../../services/api";
import Food, { FoodType } from "../../components/Food";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";


export default function Dashboard() {
  
  const [foods, setFoods] = useState<FoodType[]>([]);
  const [editingFood, setEditingFood] = useState({} as FoodType);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);


  async function getFoods() {
    const response = await api.get("/foods");
    setFoods(response.data);
  };

  useEffect(() => {
    getFoods();
  }, []);
  
  async function handleAddFood(food: FoodType) {
    try {
      const response = await api.post("/foods", {
        ...foods,
        available: true,
      });
      setFoods([...foods, response.data]);
    } catch (error) {
      console.log(error.message);
    }
  };

  async function handleUpdateFood(food: FoodType) {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map(food =>
        food.id !== foodUpdated.data.id ? food : foodUpdated.data
      );

      setFoods(foodsUpdated);
    } catch (error) {
      console.log(error.message);
    };
  };

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  };

  function toggleModal() {
    setModalOpen(!modalOpen);
  };

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen)
  };

  function handleEditFood(food: FoodType) {
    setEditingFood(food);
    setEditModalOpen(true);
  };
  
  return(
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
        foods.map((food) => (
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
}