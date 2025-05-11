export default function CreateForm() {
  return (
    <div className="flex flex-col md:flex-row gap-8 mt-10">
      {/* Left: Square Upload Placeholder */}
      <div className="w-full md:w-1/2">
        <label
          htmlFor="upload"
          className="block aspect-square border-2 border-dashed rounded-xl cursor-pointer bg-gray-100 flex items-center justify-center overflow-hidden"
        >
          <span className="text-blue text-sm">Click to upload image or GIF</span>
        </label>
        <input id="upload" type="file" accept="image/*" className="hidden" />
      </div>

      {/* Right: Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-between">
        <div className="text-sm">
          {/* Caption */}
          <textarea
            placeholder="Add a caption..."
            className="w-full p-3 border-2 border-blue text-black placeholder:text-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-blue text-[16px]"
            rows={4}
          />

          {/* Dropdown with icon */}
          <div className="relative w-fit my-4">
            <select
              className="appearance-none w-full px-6 py-2 pr-10 bg-blue text-white font-semibold rounded-full text-sm cursor-pointer text-center"
            >
              <option>Open Suggestions</option>
              <option>Vote Only</option>
              <option>Hybrid</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Name Options */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Option One..."
              className="w-full px-4 py-4 border-blue border-2 text-black rounded-[12px] placeholder-blue text-[16px] focus:ring-blue"
            />
            <input
              type="text"
              placeholder="Option Two..."
              className="w-full px-4 py-4 border-blue border-2 text-black rounded-[12px] placeholder-blue text-[16px] focus:ring-blue"
            />
            <button
              type="button"
              className="w-full flex items-center justify-between px-4 py-[15px] bg-blue text-white rounded-[12px] text-[16px]"
            >
              <span>Add Option</span>
              <span className="mr-4 text-xl">+</span>
            </button>
          </div>
        </div>

        {/* Submit Button aligned with bottom */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-pink text-white font-semibold text-[16px] py-[15px] px-6 rounded-lg hover:bg-pink/75 transition"
          >
            Submit Entry
          </button>
        </div>
      </div>
    </div>
  );
}
