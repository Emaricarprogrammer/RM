
export async function updateVideoData(videoId, formData) {
  console.log("Atualizando vídeo:", videoId, formData);

  // Simulando delay de rede
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: true,
    message: "Vídeo atualizado com sucesso!",
  };
}
