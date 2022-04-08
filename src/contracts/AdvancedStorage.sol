// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.13;

//Smart contract de almacenamiento de datos avanzado.
contract AdvancedStorage{

        //Array de los numeros/ids
        uint[] public ids;

        //funcion añadir un numero/id
        function add(uint _id) public{
            ids.push(_id);
        }

        //funcion obtener el numero/id, indicando la posicion del numero
        function get(uint _position) view public returns(uint){
            return ids[_position];
        }
        //Obtener todos los numeros/ids introducidos.
        function getAll() view public returns(uint[] memory){
            return ids;
        }
        //Obtener cuantos numeros/ids hay introducidos.
        function length()view public returns(uint){
            return ids.length;
        }



}