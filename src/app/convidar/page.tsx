"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./page.module.css";
import { FaEdit, FaShareAlt } from "react-icons/fa"; 
import { BiLike , BiDislike } from "react-icons/bi";
// Importando o ícone de edição

interface Guest {
  id: string;
  prefix: string;
  convidado: string;
  quantidade: number;
  confirmado: boolean;
  quantidadeConfirmada: number;
}

export default function GuestList() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const [editedPrefix, setEditedPrefix] = useState<string>("");

  const fetchGuests = async () => {
    try {
      const response = await axios.get(
        "https://cic9cdhu3i.execute-api.us-east-1.amazonaws.com/dev/convidados",
        {
          headers: {
            Origin: "http://localhost:3000",
          },
        }
      );

      setGuests(
        response.data.map((guest: Guest) => ({
          ...guest,
          prefix: guest.prefix || "",
          confirmado: guest.confirmado || false,
          quantidadeConfirmada: guest.quantidadeConfirmada || 0,
        }))
      );
      setLoading(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.message);
      } else {
        setError("Erro desconhecido.");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleEditClick = (index: number, prefix: string, name: string) => {
    setEditIndex(index);
    setEditedPrefix(prefix);
    setEditedName(name);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const handlePrefixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedPrefix(e.target.value);
  };

  const handleSaveClick = (index: number) => {
    const updatedGuests = guests.map((guest, i) =>
      i === index
        ? { ...guest, convidado: editedName, prefix: editedPrefix }
        : guest
    );
    setGuests(updatedGuests);
    setEditIndex(null);
  };

  const generateInviteLink = (guest: Guest) => {
    const name = encodeURIComponent(guest.convidado);
    const quantity = guest.quantidade;
    const prefix = guest.prefix || "Sr.";
    return `https://nicole-e-victor.netlify.app/?name=${name}&prefix=${prefix}&quantity=${quantity}`;
  };

  if (loading) {
    return <p>Carregando convidados...</p>;
  }

  if (error) {
    return <p>Erro: {error}</p>;
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Lista de Convidados</h1>
      <h3>
        convidados: {guests.reduce((acc, curr) => curr.quantidade + acc, 0)}
      </h3>
      <h3>já responderam: {guests.filter((q) => q.confirmado).length}</h3>
      <h3 className={styles.subtitle}>
        confirmados:{" "}
        {guests
          .filter((g) => g.confirmado)
          .reduce((acc, curr) => curr.quantidadeConfirmada + acc, 0)}
      </h3>

      {guests.map((guest, index) => (
        <div
          key={index}
          className={
            guest.confirmado && guest.quantidadeConfirmada === 0
              ? styles.card_disabled
              : styles.card
          }
        >
          <div className={styles["card-content"]}>
            <div className={styles["card-header"]}>
              {editIndex === index ? (
                <>
                  <input
                    type="text"
                    value={editedPrefix}
                    onChange={handlePrefixChange}
                    className={styles["edit-input"]}
                    placeholder="Prefixo"
                  />
                  <input
                    type="text"
                    value={editedName}
                    onChange={handleNameChange}
                    className={styles["edit-input"]}
                    placeholder="Nome"
                  />
                </>
              ) : (
                <>
                  {guest.prefix} {guest.convidado}
                  <FaEdit
                    className={styles["edit-icon"]}
                    onClick={() =>
                      handleEditClick(index, guest.prefix, guest.convidado)
                    }
                  />
                </>
              )}
            </div>
            <div className={styles["card-info"]}>
              <span>Quantidade: {guest.quantidade}</span>
              <span className={styles.amount}>
                confirmados: {guest.quantidadeConfirmada}
              </span>
              <span>
                {guest.confirmado ? (
                  <span className={`${styles.badge} ${styles.confirmed}`}>
                    Confirmado
                  </span>
                ) : (
                  <span className={`${styles.badge} ${styles.unconfirmed}`}>
                    Não confirmado
                  </span>
                )}
              </span>
            </div>
          </div>
          <FaShareAlt
            onClick={() => window.open(generateInviteLink(guest), "_blank")}
          ></FaShareAlt>
          {editIndex === index && (
            <button
              className={styles["save-button"]}
              onClick={() => handleSaveClick(index)}
            >
              Salvar
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
