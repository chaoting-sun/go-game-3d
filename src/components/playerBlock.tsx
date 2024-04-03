const PlayerBlock = ({ name, photo, rank, captures, stoneColor }) => {
  const colorClass =
    stoneColor === "black"
      ? "bg-gradient-to-r from-gray-700 to-black"
      : "bg-gradient-to-r from-gray-100 to-white";

  const textColor = stoneColor === "black" ? "text-slate-200" : "text-slate-800";

  return (
    <div className={`rounded-2xl flex justify-evenly items-center ${colorClass}`}>
      <div className="w-2/5 p-4">
        <img
          src={photo}
          alt=""
          className="h-[80%] aspect-square object-contain"
        />
      </div>
      <div className="w-3/5 flex flex-col">
        <h1 className={`text-2xl ${textColor}`}>{name} [{rank}]</h1>
        <p className={`${textColor}`}>{captures} captures</p>
      </div>
    </div>
  );
};

export default PlayerBlock;
