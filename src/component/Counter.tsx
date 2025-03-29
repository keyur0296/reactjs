import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { decrement, increment } from "../app/reducers/counterSlice";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

export function Counter() {
  // The `state` arg is correctly typed as `RootState` already
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div>
      {user && <h1>Welcome {user.name}</h1>}
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  );
}
