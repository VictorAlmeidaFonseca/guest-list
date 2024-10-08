"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./page.module.css"; // Importando CSS Modules

interface Guest {
  prefix: string;
  convidado: string;
  quantidade: number;
  confirmado?: boolean;
  quantidadeConfirmada?: number;
}

export default function GuestList() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newGuest, setNewGuest] = useState<Guest>({
    prefix: "",
    convidado: "",
    quantidade: 0,
    confirmado: false,
    quantidadeConfirmada: 0,
  });

  // Função para buscar os dados da API
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

      console.log(response.data); // Adiciona um log dos dados no console

      setGuests(
        response.data.map((guest: Guest) => ({
          ...guest,
          prefix: guest.prefix || "",
          aceito: guest.confirmado || false, // Inicializa com false se não houver valor
          quantidadeAceita: guest.quantidadeConfirmada || 0, // Inicializa com 0 se não houver valor
        }))
      );
      setLoading(false);
    } catch (err) {
      console.error(err); // Adiciona um log do erro no console

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

  // Função para lidar com a alteração no nome ou quantidade
  const handleChange = (
    index: number,
    field: "convidado" | "quantidade" | "prefix" | "quantidadeConfirmada" | "confirmado",
    value: string | number | boolean
  ) => {
    const newGuests = [...guests];
    (newGuests[index][field] as typeof value) = value;
    setGuests(newGuests);
  };

  // Função para adicionar um novo convidado inline
  const addGuest = () => {
    setGuests([...guests, newGuest]);
    setNewGuest({ prefix: "", convidado: "", quantidade: 0, confirmado: false, quantidadeConfirmada: 0 });
  };

  // Função para gerar o link de convite
  const generateInviteLink = (guest: Guest) => {
    const name = encodeURIComponent(guest.convidado);
    const quantity = guest.quantidade;
    const prefix = guest.prefix || "Sr."; // Você pode personalizar isso
    return `http://localhost:3000/?name=${name}&prefix=${prefix}&quantity=${quantity}`;
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
      <h3 className={styles.subTitle}>total: {guests.reduce(((acc, curr) => curr.quantidade + acc), 0) }</h3>
      <h3 className={styles.subTitle}>confirmados: {guests.filter(g => g.confirmado).reduce(((acc, curr) => (curr.quantidadeConfirmada ?? 0) + acc), 0) }</h3>
      {/* Tabela de convidados */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>Tratamento</th>
            <th className={styles.tableHeader}>Convidado</th>
            <th className={styles.tableHeader}>Quantidade</th>
            <th className={styles.tableHeader}>Aceito</th>
            <th className={styles.tableHeader}>Quantidade Aceita</th>
            <th className={styles.tableHeader}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {/* Linha para adicionar novo convidado inline */}
          <tr className={styles.tableRow}>
            <td className={styles.tableCell}>
              <input
                className={styles.inputText}
                type="text"
                placeholder="Tratamento"
                value={newGuest.prefix}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, prefix: e.target.value })
                }
              />
            </td>
            <td className={styles.tableCell}>
              <input
                className={styles.inputText}
                type="text"
                placeholder="Nome do Convidado"
                value={newGuest.convidado}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, convidado: e.target.value })
                }
              />
            </td>
            <td className={styles.tableCell}>
              <input
                className={styles.inputNumber}
                type="number"
                placeholder="Quantidade"
                value={newGuest.quantidade}
                onChange={(e) =>
                  setNewGuest({
                    ...newGuest,
                    quantidade: Number(e.target.value),
                  })
                }
              />
            </td>
            <td className={styles.tableCell}>
              <input
                className={styles.inputNumber}
                type="checkbox"
                checked={newGuest.confirmado}
                onChange={(e) =>
                  setNewGuest({
                    ...newGuest,
                    confirmado: e.target.checked,
                  })
                }
              />
            </td>
            <td className={styles.tableCell}>
              <input
                className={styles.inputNumber}
                type="number"
                placeholder="Qtd Aceita"
                value={newGuest.quantidadeConfirmada}
                onChange={(e) =>
                  setNewGuest({
                    ...newGuest,
                    quantidadeConfirmada: Number(e.target.value),
                  })
                }
              />
            </td>
            <td className={styles.tableCell}>
              <button className={styles.addButton} onClick={addGuest}>
                Adicionar
              </button>
            </td>
          </tr>

          {/* Exibição dos convidados */}
          {guests.map((guest, index) => (
            <tr key={index} className={styles.tableRow}>
              <td className={styles.tableCell}>
                <input
                  className={styles.inputText}
                  type="text"
                  value={guest.prefix || ""}
                  onChange={(e) =>
                    handleChange(index, "prefix", e.target.value)
                  }
                />
              </td>
              <td className={styles.tableCell}>
                <input
                  className={styles.inputText}
                  type="text"
                  value={guest.convidado}
                  onChange={(e) =>
                    handleChange(index, "convidado", e.target.value)
                  }
                />
              </td>
              <td className={styles.tableCell}>
                <input
                  className={styles.inputNumber}
                  type="number"
                  value={guest.quantidade}
                  onChange={(e) =>
                    handleChange(index, "quantidade", Number(e.target.value))
                  }
                />
              </td>
              <td className={styles.tableCell}>
                <input
                  className={styles.inputNumber}
                  type="checkbox"
                  checked={guest.confirmado || false}
                  onChange={(e) =>
                    handleChange(index, "confirmado", e.target.checked)
                  }
                />
              </td>
              <td className={styles.tableCell}>
                <input
                  className={styles.inputNumber}
                  type="number"
                  value={guest.quantidadeConfirmada || 0}
                  onChange={(e) =>
                    handleChange(index, "quantidadeConfirmada", Number(e.target.value))
                  }
                />
              </td>
              <td className={styles.tableCell}>
                <button
                  className={styles.inviteButton}
                  onClick={() => window.open(generateInviteLink(guest), "_blank")}
                >
                  Convidar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
