"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ChefHat, MapPin, Utensils } from "lucide-react";
import { cookbookData } from "./recipelist";

interface Ingredient {
  item: string;
  quantity: string;
}

interface Recipe {
  name: string;
  introduction: string;
  ingredients: Ingredient[];
  steps: string[];
  prepTime?: string;
  cookTime?: string;
  servings?: number;
  difficulty?: "Easy" | "Medium" | "Hard";
}

export default function Cookbook() {
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedDish, setSelectedDish] = useState<string>("");
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [trySomethingNew, setTrySomethingNew] = useState<boolean>(false);
  const [customDishName, setCustomDishName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Loader state

  const handleTrySomethingNewChange = (checked: boolean) => {
    setTrySomethingNew(checked);
    if (checked) {
      setSelectedDish("");
    } else {
      setCustomDishName("");
    }
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setSelectedDish("");
    setCurrentRecipe(null);
  };

  const handleDishChange = (dish: string) => {
    setSelectedDish(dish);
    setCurrentRecipe(null);
  };

  const handleGetRecipe = async () => {
    const dishToQuery = trySomethingNew ? customDishName.trim() : selectedDish;
    if (!dishToQuery) return;

    setLoading(true);

    try {
      const response = await fetch("/api/get-recipe", {
        method: "POST",
        body: JSON.stringify({ dish: dishToQuery, region: selectedRegion }),
      });

      const data = await response.json();
      const recipe = data?.data;

      if (recipe) {
        setCurrentRecipe(recipe);
      } else {
        setCurrentRecipe({
          name: dishToQuery,
          introduction:
            "Detailed recipe instructions will be available soon. This is a traditional dish with rich flavors and authentic preparation methods.",
          ingredients: [
            { item: "Recipe ingredients will be added soon...", quantity: "" },
          ],
          steps: [
            "Detailed recipe instructions will be available soon. This is a traditional dish with rich flavors and authentic preparation methods.",
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  const regions = Object.keys(cookbookData);
  const dishes = selectedRegion
    ? cookbookData[selectedRegion as keyof typeof cookbookData]
    : [];

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/food.jpg')` }}
    >
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-2">
            <ChefHat className="w-8 h-8 text-orange-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              Indian Cookbook
            </h1>
          </div>
          <p className="text-gray-600 text-center mt-2">
            Discover authentic flavors from across India
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-orange-100 to-red-100 border-orange-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="font-semibold text-orange-800 mb-2">
                    How it works
                  </h3>
                  <p className="text-sm text-orange-700">
                    Choose your preferred region, select a dish, and click "Get
                    Recipe" to see the detailed recipe on the right!
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="w-5 h-5" />
                  Recipe Finder
                </CardTitle>
                <CardDescription>
                  Select a region first, then choose your favorite dish
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Select Region
                  </label>
                  <Select
                    value={selectedRegion}
                    onValueChange={handleRegionChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a region..." />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {!trySomethingNew && selectedRegion && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <ChefHat className="w-4 h-4" />
                      Select Dish
                    </label>
                    <Select
                      value={selectedDish}
                      onValueChange={handleDishChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a dish..." />
                      </SelectTrigger>
                      <SelectContent>
                        {dishes.map((dish) => (
                          <SelectItem key={dish} value={dish}>
                            {dish}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="tryNew"
                    checked={trySomethingNew}
                    onChange={(e) =>
                      handleTrySomethingNewChange(e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor="tryNew"
                    className="text-sm cursor-pointer select-none"
                  >
                    Try something new
                  </label>
                </div>

                {trySomethingNew && (
                  <div className="space-y-2">
                    <label htmlFor="customDish" className="text-sm font-medium">
                      Enter Recipe Name
                    </label>
                    <input
                      id="customDish"
                      type="text"
                      value={customDishName}
                      onChange={(e) => setCustomDishName(e.target.value)}
                      placeholder="Type a dish name..."
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                )}

                {selectedRegion && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-2">
                      Your Selection:
                    </h3>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Region:</span>{" "}
                      {selectedRegion}
                    </p>
                    {selectedDish && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Dish:</span>{" "}
                        {selectedDish}
                      </p>
                    )}
                  </div>
                )}

                <Button
                  onClick={handleGetRecipe}
                  disabled={!selectedDish && !trySomethingNew}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  size="lg"
                >
                  <ChefHat className="w-4 h-4 mr-2" />
                  Get Recipe
                </Button>

                {!selectedRegion && (
                  <p className="text-sm text-gray-500 text-center">
                    Start by selecting a region to see available dishes
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {loading ? (
              <Card className="shadow-lg h-96 flex items-center justify-center">
                <div className="text-center animate-pulse">
                  <ChefHat className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-medium text-orange-700 mb-2">
                    Fetching Recipe...
                  </h3>
                  <p className="text-sm text-orange-600">
                    Please wait while we cook something up!
                  </p>
                </div>
              </Card>
            ) : currentRecipe ? (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChefHat className="w-5 h-5" />
                    {currentRecipe.name}
                  </CardTitle>
                  <CardDescription>From {selectedRegion}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-gray-700">{currentRecipe.introduction}</p>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Utensils className="w-4 h-4" />
                      Ingredients
                    </h3>
                    <ul className="space-y-2">
                      {currentRecipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span className="text-sm text-gray-700">
                            {ingredient.item}
                            {ingredient.quantity && ` - ${ingredient.quantity}`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <ChefHat className="w-4 h-4" />
                      Instructions
                    </h3>
                    <ol className="space-y-3">
                      {currentRecipe.steps.map((step, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="text-sm text-gray-700 pt-0.5">
                            {step}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">
                    No Recipe Selected
                  </h3>
                  <p className="text-sm text-gray-400">
                    Select a region and dish from the left panel, then click
                    "Get Recipe" to see the detailed recipe here.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
