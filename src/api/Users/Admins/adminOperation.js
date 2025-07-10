// src/app/api/admins.js
import { api } from "@/api/api";


// src/app/api/admins.js

export const fetchAllAdmins = async (token) => {
  try {
    const response = await api.get("/users/admins/all/admins", {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Corrigindo o typo 'maap' para 'map'
    const adminsData = (response.data?.response || response.data) ?? [];
    const AdminDatas = Array.isArray(adminsData) ? adminsData : adminsData.data || adminsData.users || adminsData.admins || [];
    
    const formattedAdmins = AdminDatas.map(admin => ({
      id_admin: admin.id_admin || admin.id || null,
      full_name: admin.full_name || admin.name || admin.username || 'Não informado',
      email: admin.email || 'Não informado',
      contact: admin.contact || '',
      access_level: admin.access_level || admin.role || 'standard',
      createdAt: admin.createdAt || admin.creation_date || new Date().toISOString(),
      id_account: admin.id_account || null,
      id_user_fk: admin.id_user_fk || admin.user_id || null
    }));
    
    return {
      adminsData: formattedAdmins,
      message: response.data?.message
    };
  } catch (error) {
    console.error("Erro ao buscar administradores:", error);
    throw new Error(error.response?.data?.message || error.message || "Erro ao buscar administradores");
  }
};

export const createAdmin = async (token, adminData) => {
  try {
    const response = await api.post("/users/admins/signup", {
      ...adminData,
      access_level: "ADMIN"
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return {
      success: true,
      message: response.data?.message || "Administrador criado com sucesso"
    };
  } catch (error) {
    console.error("Erro ao criar administrador:", error);
    throw new Error(error.response?.data?.message || error.message || "Erro ao criar administrador");
  }
};

export const updateAdmin = async (token, adminId, updateData) => {
  try {
    const payload = {};
    
    if (updateData.full_name && updateData.full_name.trim() !== "") payload.full_name = updateData.full_name;
    if (updateData.email && updateData.email.trim() !== "") payload.email = updateData.email;
    if (updateData.contact && updateData.contact.trim() !== "") payload.contact = String(updateData.contact);
    if (updateData.currentPassword && updateData.currentPassword.trim() !== "") payload.password = updateData.currentPassword;
    if (updateData.newPassword && updateData.newPassword.trim() !== "") payload.newPassword = updateData.newPassword;

    if (Object.keys(payload).length === 0) {
      throw new Error("Preencha pelo menos um campo para atualizar.");
    }

    const response = await api.patch(
      `/users/admins/profile/edit/${adminId}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return {
      success: true,
      message: response.data?.message || "Administrador atualizado com sucesso"
    };
  } catch (error) {
    console.error("Erro ao atualizar administrador:", error);
    throw new Error(error.response?.data?.message || error.message || "Erro ao atualizar administrador");
  }
};

export const deleteAdmin = async (token, adminId) => {
  try {
    const response = await api.delete(
      `/users/admins/delete/${adminId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return {
      success: true,
      message: response.data?.message || "Administrador removido com sucesso"
    };
  } catch (error) {
    console.error("Erro ao deletar administrador:", error);
    throw new Error(error.response?.data?.message || error.message || "Erro ao remover administrador");
  }
};