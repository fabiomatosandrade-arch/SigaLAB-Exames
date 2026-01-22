
import React, { useState, useRef } from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>({ ...user });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedUser(prev => ({ ...prev, profilePicture: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdateUser(editedUser);
    setIsEditing(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-indigo-600 h-32 relative">
        <div className="absolute -bottom-12 left-8 group cursor-pointer" onClick={isEditing ? triggerFileInput : undefined}>
          <div className="bg-white p-2 rounded-2xl shadow-lg border border-slate-100 relative">
             <div className="w-24 h-24 bg-slate-100 rounded-xl flex items-center justify-center text-indigo-600 overflow-hidden">
               {editedUser.profilePicture || user.profilePicture ? (
                 <img 
                   src={isEditing ? editedUser.profilePicture : user.profilePicture} 
                   alt="Perfil" 
                   className="w-full h-full object-cover"
                 />
               ) : (
                 <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                 </svg>
               )}
               {isEditing && (
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                   </svg>
                 </div>
               )}
             </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleImageChange}
          />
        </div>
        <div className="absolute top-4 right-4">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl backdrop-blur-md transition font-semibold flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              Editar Perfil
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={() => { setIsEditing(false); setEditedUser({ ...user }); }}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl backdrop-blur-md transition font-semibold"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-xl transition font-semibold shadow-lg"
              >
                Salvar Alterações
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="pt-16 p-8">
        {!isEditing ? (
          <>
            <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
            <p className="text-slate-500 mb-8">@{user.username}</p>
          </>
        ) : (
          <div className="mb-8 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Nome Completo</label>
              <input 
                type="text" 
                name="name"
                value={editedUser.name}
                onChange={handleInputChange}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Dados Pessoais</h3>
            
            <div className="space-y-1">
              <p className="text-xs text-slate-400">E-mail</p>
              {isEditing ? (
                <input 
                  type="email" 
                  name="email"
                  value={editedUser.email}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="font-medium">{user.email}</p>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-400">Data de Nascimento</p>
              {isEditing ? (
                <input 
                  type="date" 
                  name="birthDate"
                  value={editedUser.birthDate}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="font-medium">{new Date(user.birthDate).toLocaleDateString('pt-BR')}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Informações Médicas</h3>
            <div className="space-y-1">
              <p className="text-xs text-slate-400">Doenças Preexistentes</p>
              {isEditing ? (
                <textarea 
                  name="preExistingConditions"
                  value={editedUser.preExistingConditions}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              ) : (
                <p className="font-medium whitespace-pre-wrap">{user.preExistingConditions || "Nenhuma informada"}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
