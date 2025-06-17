import { Filter } from "lucide-react";

export default function CourseFilters({
  categories,
  selectedCategories,
  handleCategoryChange,
  courseTypes,
  handleCourseTypeChange,
  resetCategoryFilters,
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 lg:sticky lg:top-24">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} className="text-blue-700" />
        <h2 className="text-lg font-semibold text-gray-800">Filtros</h2>
      </div>

      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-3">Modalidade</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={courseTypes.includes("online")}
              onChange={() => handleCourseTypeChange("online")}
              className="rounded text-blue-700 focus:ring-blue-700 border-gray-300"
            />
            <span className="text-gray-700">Online</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={courseTypes.includes("presential")}
              onChange={() => handleCourseTypeChange("presential")}
              className="rounded text-blue-700 focus:ring-blue-700 border-gray-300"
            />
            <span className="text-gray-700">Presencial</span>
          </label>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-3">Categorias</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
                className="rounded text-blue-700 focus:ring-blue-700 border-gray-300"
              />
              <span className="text-gray-700">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {selectedCategories.length > 0 && (
        <button
          onClick={resetCategoryFilters}
          className="mt-6 w-full text-sm text-blue-700 hover:text-blue-900 font-medium py-2 px-4 border border-blue-700 rounded-md transition-colors hover:border-blue-900"
        >
          Remover filtros de categoria
        </button>
      )}
    </div>
  );
}
