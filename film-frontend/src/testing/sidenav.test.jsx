import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Sidenav from "../src/components/Sidenav";


describe("Sidenav Component", () => {

  it("renders login and sign-up links when role is not set", () => {
    render(<Sidenav />);
    
    expect(screen.getByText("Login")).not.toBeNull();
    expect(screen.getByText("Sign Up")).not.toBeNull();
  });

  it("renders user links when role is 'user'", () => {
    sessionStorage.setItem('role_id', 'user'); // Set role to user
    render(<Sidenav />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Input Drama")).toBeInTheDocument();
    expect(screen.getByText("Log Out")).toBeInTheDocument();
    expect(screen.queryByText("CMS")).toBeNull(); // Ensure admin link is not present
  });

  it("renders admin links when role is 'admin'", () => {
    sessionStorage.setItem('role_id', 'admin'); // Set role to admin
    render(<Sidenav />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("CMS")).toBeInTheDocument();
    expect(screen.getByText("Log Out")).toBeInTheDocument();
    expect(screen.queryByText("Input Drama")).toBeNull(); // Ensure user link is not present
  });

});

