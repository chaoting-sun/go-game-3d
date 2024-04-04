const MoveControl = ({ onMoveControl }) => {
  return (
    <div className="bg-[#7e90b2] rounded m-4 flex justify-between items-center p-3">
      <button
        className="bg-[#d2d7e5] flex justify-center items-center h-[38px] w-[38px] rounded"
        onClick={() => onMoveControl("--")}
      >
        <span className="material-symbols-outlined">fast_rewind</span>
      </button>
      <button
        className="bg-[#d2d7e5] flex justify-center items-center h-[38px] w-[38px] rounded"
        onClick={() => onMoveControl("-")}
      >
        <span className="material-symbols-outlined">skip_previous</span>
      </button>
      <button
        className="bg-[#d2d7e5] flex justify-center items-center h-[38px] w-[38px] rounded"
        onClick={() => onMoveControl("+")}
      >
        <span className="material-symbols-outlined">skip_next</span>
      </button>
      <button
        className="bg-[#d2d7e5] flex justify-center items-center h-[38px] w-[38px] rounded"
        onClick={() => onMoveControl("++")}
      >
        <span className="material-symbols-outlined">fast_forward</span>
      </button>
    </div>
  );
};

export default MoveControl;
