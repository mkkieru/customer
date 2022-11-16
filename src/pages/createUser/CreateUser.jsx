import React from "react";
import "./createUser.css";

function CreateUser() {
  return (
    <div className="newUser">
      <h1 className="newUserTitle">New User</h1>
      <form className="newUserForm">
        <div className="newUserItem">
          <label htmlFor="">UserName</label>
          <input type="text" placeholder="Mark" />
        </div>
        <div className="newUserItem">
          <label htmlFor="">Full Name</label>
          <input type="text" placeholder="Mark Kieru" />
        </div>
        <div className="newUserItem">
          <label htmlFor="">Email</label>
          <input type="email" placeholder="mkieru55@gmail.com" />
        </div>
        <div className="newUserItem">
          <label htmlFor="">Password</label>
          <input type="password" placeholder="MarkKieru55" />
        </div>
        <div className="newUserItem">
          <label htmlFor="">Phone</label>
          <input type="number" placeholder="0712292899" />
        </div>
        <div className="newUserItem">
          <label htmlFor="">Address</label>
          <input type="text" placeholder="Villa Franca | Embakasi" />
        </div>

        <div className="newUserItem">
          <label htmlFor="">Property</label>
          <select name="property" id="property" className="newUserSelect">
            <option value="Tassia">Tassia</option>
            <option value="Witeithie">Witeithie</option>
            <option value="TollStation">Toll Station</option>
          </select>
        </div>
        <button className="newUserButton">Create</button>
      </form>
    </div>
  );
}

export default CreateUser;
