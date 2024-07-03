import './App.css';
import { useState } from 'react';

let user = {
  name: "wer"
};
let content = {};
let isLoggedIn = false;

const products = [
  { title: 'Cabbage', id: 1, selected: false },
  { title: 'Garlic', id: 2, selected: true },
  { title: 'Apple', id: 3, selected: false },
];

const listItems = products.map(product =>
  <li key={product.id} style={{ color: product.selected ? 'green' : 'pink'}}>
    {product.title}
  </li>
);

if (isLoggedIn) {
  content = <MyButton />;
} else {
  content = <Ver />;
}

function MyButton() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick} className="select" >I'm a button</button>
  );
}

function Ver() {
  return (
    <button style={{ color: "red" }}> {user.name}</button >
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <h2>dis play component in react that is create function and return in HTML tag like this:  <MyButton />
        <Ver /> actually ther are {'<MyButton/>'} and {'<Ver/>'}</h2>
      <h2>if content result is "{content}"</h2>
      <h2>list item by map function and if product.selected make it green</h2>
      {listItems}
    </div>
  );
}