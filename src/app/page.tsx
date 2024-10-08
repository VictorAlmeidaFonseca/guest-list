"use client";

import { useSearchParams, useRouter } from "next/navigation"; // Adicionar useRouter
import { useEffect, useState } from "react";

import styles from "./page.module.css";

export default function Home() {
  const [quantity, setQuantity] = useState<number | null>(0); // Quantidade de pessoas
  const [name, setName] = useState<string | null>(""); // Nome da pessoa
  const [prefix, setPrefix] = useState<string | null>(""); // Prefixo (Sr./Sra./etc.)
  const [going, setGoing] = useState<boolean | null>(null); // Se a pessoa vai comparecer ou não
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1); // Quantidade de pessoas selecionadas
  const router = useRouter(); // Inicializa o router para redirecionamento

  const searchParams = useSearchParams();

  useEffect(() => {
    setName(searchParams.get("name"));
    setQuantity(
      searchParams.get("quantity")
        ? parseInt(searchParams.get("quantity") as string, 10)
        : null
    );
    setPrefix(searchParams.get("prefix"));
  }, [searchParams]);

  // Função para tratar a seleção de presença
  const handleGoingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setGoing(value === "yes");
  };

  // Função para capturar a quantidade de pessoas selecionada
  const handleQuantityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = parseInt(event.target.value, 10);
    setSelectedQuantity(value);
  };

  // Função para envio do formulário
  const handleSubmit = async () => {
    if (going) {
      const body = {
        convidado: name,
        quantidade: quantity,
        prefixo: prefix || "",
        confirmado: true,
        quantidadeConfirmada: selectedQuantity,
      };

      try {
        const response = await fetch(
          "https://cic9cdhu3i.execute-api.us-east-1.amazonaws.com/dev/confirmar",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }
        );

        if (response.ok) {
          console.log("Confirmação enviada com sucesso!");
          // Redireciona para a página de agradecimento após o envio bem-sucedido
          router.push("/agradecer");
        } else {
          console.log("Erro ao enviar a confirmação:", response.statusText);
        }
      } catch (error) {
        console.error("Erro de requisição:", error);
      }
    } else {
      console.log("Infelizmente, não poderá comparecer.");
    }
  };

  // Links para Google Maps e Waze com suas coordenadas personalizadas
  // const googleMapsLink = `https://www.google.com/maps/dir/?api=1&destination=-23.525884144098423,-47.58460169398168`;
  // const wazeLink = `https://waze.com/ul?ll=-23.525884144098423,-47.58460169398168&navigate=yes`;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>N & V</h1>
        <span className={styles.date}>15.12.2024</span>
      </div>
      <main className={styles.main}>
        <h2 className={styles.invitationTitle}>{`${prefix} ${name}`},</h2>
        <h3 className={styles.invitationSubTitle}>
          é com muita alegria que convidamos você para o dia do nosso casamento!
        </h3>

        <div className={styles.selectWrapper}>
          <label htmlFor="confirmar">Podemos contar com sua presença?</label>
          <select
            id="confirmar"
            className={styles.customSelect}
            onChange={handleGoingChange}
          >
            <option value="">Selecione uma opção</option>
            <option value="yes">Sim, confirmo minha presença</option>
            <option value="no">Infelizmente, não poderei comparecer</option>
          </select>
        </div>

        {going && quantity && quantity > 1 && (
          <div className={styles.selectWrapper}>
            <label htmlFor="quantidade">Quantas pessoas irão?</label>
            <select
              id="quantidade"
              className={styles.customSelect}
              value={selectedQuantity}
              onChange={handleQuantityChange}
            >
              {Array.from({ length: quantity }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "pessoa" : "pessoas"}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.sendButton}>
          <button onClick={handleSubmit}>Enviar</button>
        </div>
      </main>
      <footer className={styles.footer}>
        {/* <h3>Como chegar:</h3>
        <div className={styles.mapLinks}>
          <a href={googleMapsLink} target="_blank" rel="noopener noreferrer">
            <img src="/icons8-google-maps.svg" alt="Google Maps" className={styles.icon} />
          </a>
          <a href={wazeLink} target="_blank" rel="noopener noreferrer">
            <img src="/icons8-waze.svg" alt="Waze" className={styles.icon} />
          </a>
        </div> */}
      </footer>
    </div>
  );
}
