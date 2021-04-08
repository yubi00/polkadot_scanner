import React from "react";

interface Props {}

export const InputForm = (props: Props) => {
  return (
    <div>
      <form>
        <input type='text' placeholder='start block' />
        <input type='text' placeholder='end block' />
        <input type='text' placeholder='end point' />
        <button>Scan</button>
      </form>
    </div>
  );
};
