
import React, { useState, useRef } from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editedUser, setEditedUser] = useState<User>({ ...user });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');
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
    setSaveStatus('saving');
    // Simulando delay de rede
    setTimeout(() => {
      onUpdateUser(editedUser);
      setIsEditing(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 600);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gerenciar Cadastro</h2>
          <p className="text-slate-500">Mantenha seus dados e preferências sempre atualizados.</p>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition flex items-center gap-2 shadow-lg shadow-indigo-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            Alterar Cadastro
          </button>
        ) : (
          <div className="flex gap-3">
            <button 
              onClick={() => { setIsEditing(false); setEditedUser({ ...user }); }}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-5 py-2.5 rounded-xl font-semibold transition"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition shadow-lg flex items-center gap-2"
            >
              {saveStatus === 'saving' ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              )}
              Salvar Alterações
            </button>
          </div>
        )}
      </header>

      {saveStatus === 'success' && (
        <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 animate-bounce">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Cadastro atualizado com sucesso!
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Banner de Perfil */}
        <div className="bg-indigo-600 h-40 relative">
          <div className="absolute -bottom-16 left-8 group">
            <div className="bg-white p-2 rounded-3xl shadow-xl relative border border-slate-100">
              <div 
                className={`w-32 h-32 rounded-2xl bg-slate-100 flex items-center justify-center text-indigo-600 overflow-hidden relative ${isEditing ? 'cursor-pointer hover:opacity-90' : ''}`}
                onClick={isEditing ? triggerFileInput : undefined}
              >
                {(isEditing ? editedUser.profilePicture : user.profilePicture) ? (
                  <img 
                    src={isEditing ? editedUser.profilePicture : user.profilePicture} 
                    alt="Perfil" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                )}
                {isEditing && (
                  <div className="absolute inset-0 bg-indigo-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
        </div>

        <div className="pt-20 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            
            {/* Seção Dados Pessoais */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Informações Pessoais</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Nome Completo</label>
                  {isEditing ? (
                    <input type="text" name="name" value={editedUser.name} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  ) : (
                    <p className="text-slate-800 font-medium">{user.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Nascimento</label>
                    {isEditing ? (
                      <input type="date" name="birthDate" value={editedUser.birthDate} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                    ) : (
                      <p className="text-slate-800 font-medium">{new Date(user.birthDate).toLocaleDateString('pt-BR')}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">E-mail</label>
                    {isEditing ? (
                      <input type="email" name="email" value={editedUser.email} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                    ) : (
                      <p className="text-slate-800 font-medium">{user.email}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Seção Saúde */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Informações de Saúde</h3>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Doenças Preexistentes</label>
                {isEditing ? (
                  <textarea name="preExistingConditions" value={editedUser.preExistingConditions} onChange={handleInputChange} rows={4} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
                ) : (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-slate-700 whitespace-pre-wrap">{user.preExistingConditions || "Nenhuma informação registrada."}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Seção Segurança */}
            <div className="space-y-6 md:col-span-2 mt-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Segurança da Conta</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Nome de Usuário</label>
                  {isEditing ? (
                    <input type="text" name="username" value={editedUser.username} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  ) : (
                    <p className="text-slate-800 font-bold">@{user.username}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Senha</label>
                  {isEditing ? (
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        name="password" 
                        value={editedUser.password} 
                        onChange={handleInputChange} 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none pr-12" 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPassword ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path></svg>}
                      </button>
                    </div>
                  ) : (
                    <p className="text-slate-400 font-mono tracking-tighter">••••••••••••</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
