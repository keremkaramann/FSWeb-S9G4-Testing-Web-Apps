import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";

beforeEach(() => {
  render(<IletisimFormu />);
});

test("hata olmadan render ediliyor", () => {
  render(<IletisimFormu />);
});

test("iletişim formu headerı render ediliyor", () => {
  const header = screen.getByTestId("header-testi");
  //const header=screen.getByRole("header",{level:1})
  expect(header).toHaveTextContent("İletişim Formu");
  expect(header).toBeInTheDocument();
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  const adInput = screen.getByTestId("ad-testi");
  //const adInput=screen.getByLabel("Ad*")
  //userEvent.type(adInput,"abc")
  //const err=await screen.findAllByTestId("error")
  //expect(err).toHaveLength(1)
  fireEvent.change(adInput, { target: { value: "abc" } });

  const errMsg = screen.getByText("Hata: ad en az 5 karakter olmalıdır.");
  expect(errMsg).toBeInTheDocument();
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  const formBtn = screen.getByRole("button");

  userEvent.click(formBtn);
  await waitFor(() => {
    const errMsg = screen.queryAllByTestId("error");
    expect(errMsg).toHaveLength(3);
  });

  /*   await fireEvent.click(formBtn);

  //check error message
  const err1 = screen.getByText("Hata: ad en az 5 karakter olmalıdır.");
  const err2 = screen.getByText("Hata: soyad gereklidir.");
  const err3 = screen.getByText(
    "Hata: email geçerli bir email adresi olmalıdır."
  );
  //check values
  expect(err1).toBeInTheDocument();
  expect(err2).toBeInTheDocument();
  expect(err3).toBeInTheDocument(); */
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  const adInput = screen.getByTestId("ad-testi");
  const soyadInput = screen.getByTestId("soyad");
  const formBtn = screen.getByTestId("btn-test");
  //userEvent.type(adInput,"kerem")
  fireEvent.change(adInput, { target: { value: "kerem" } });
  fireEvent.change(soyadInput, { target: { value: "karaman" } });

  fireEvent.click(formBtn);

  const emailErr = screen.getByText(
    "Hata: email geçerli bir email adresi olmalıdır."
  );
  expect(emailErr).toBeInTheDocument();
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  const emailInput = screen.getByTestId("email-test");

  userEvent.type(emailInput, "abc");

  await waitFor(() => {
    const errMsg = screen.getByTestId("error");

    expect(errMsg).toHaveTextContent(
      "email geçerli bir email adresi olmalıdır."
    );
  });
});

test('soyad girilmeden gönderilirse "Hata: soyad gereklidir." mesajı render ediliyor', async () => {
  const nameInput = screen.getByTestId("ad-testi");
  const emailInput = screen.getByTestId("email-test");
  const formBtn = screen.getByTestId("btn-test");

  userEvent.type(nameInput, "kerem");
  userEvent.type(emailInput, "keremkaraman@gmail.com");

  fireEvent.click(formBtn);

  const soyadErr = screen.getByText("Hata: soyad gereklidir.");
  expect(soyadErr).toBeInTheDocument();
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  const nameInput = screen.getByTestId("ad-testi");
  const surnameInput = screen.getByTestId("soyad");
  const emailInput = screen.getByTestId("email-test");
  const formBtn = screen.getByTestId("btn-test");

  userEvent.type(nameInput, "kerem");
  userEvent.type(surnameInput, "karaman");
  userEvent.type(emailInput, "keremkaraman@gmail.com");

  fireEvent.click(formBtn);

  // Check if there is no error message
  await waitFor(() => {
    expect(
      screen.queryByText("Hata: ad en az 5 karakter olmalıdır.")
    ).toBeNull();
    expect(screen.queryByText("Hata: soyad gereklidir.")).toBeNull();
    expect(
      screen.queryByText("Hata: email geçerli bir email adresi olmalıdır.")
    ).toBeNull();
  });
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  const nameInput = screen.getByTestId("ad-testi");
  const surnameInput = screen.getByTestId("soyad");
  const emailInput = screen.getByTestId("email-test");
  const msgInput = screen.getByTestId("msg-test");
  const formBtn = screen.getByTestId("btn-test");

  userEvent.type(nameInput, "kerem");
  userEvent.type(surnameInput, "karaman");
  userEvent.type(emailInput, "keremkaraman@gmail.com");
  userEvent.type(msgInput, "Hello World");

  fireEvent.click(formBtn);

  const nameValue = screen.getByTestId("firstnameDisplay");
  const surnameValue = screen.getByTestId("lastnameDisplay");
  const emailValue = screen.getByTestId("emailDisplay");
  const msgValue = screen.getByTestId("messageDisplay");

  expect(nameValue).toHaveTextContent("kerem");
  expect(surnameValue).toHaveTextContent("karaman");
  expect(emailValue).toHaveTextContent("keremkaraman@gmail.com");
  expect(msgValue).toHaveTextContent("Hello World");
});
