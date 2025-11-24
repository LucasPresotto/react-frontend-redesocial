import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CampoEdicao = ({ label, valor, onChange, onSave }) => {
    return (
        <div className="mb-3">
            <label className="form-label">{label}: </label>
            <div className="input-group">
                <input className="form-control" value={valor} onChange={onChange} />
                <button className="btn btn-outline-primary" onClick={onSave}>Salvar</button>
            </div>
        </div>
    );
}

const Perfil = ({ nome: nomeInicial, bio: bioInicial }) => {
    const imgUrl = "https://www.freeiconspng.com/uploads/profile-icon-9.png";

    const [nome, setNome] = useState(nomeInicial);
    const [bio, setBio] = useState(bioInicial);
    const [bioVisivel, setBioVisivel] = useState(true);
    const [tempNome, setTempNome] = useState(nomeInicial);
    const [tempBio, setTempBio] = useState(bioInicial);

    return (
        <div className="container mt-3 p-3 border rounded">
            <h2>{nome}</h2>
            <img src={imgUrl} width={100} alt="Perfil" />
            {bioVisivel && <p className="mt-2">{bio}</p>}
            <button className="btn btn-sm btn-secondary" onClick={() => setBioVisivel(!bioVisivel)}>
                {bioVisivel ? 'Ocultar' : 'Mostrar'} Bio
            </button>
            <hr />
            <h4>Editar Perfil</h4>
            <CampoEdicao
                label="Nome"
                valor={tempNome}
                onChange={(e) => setTempNome(e.target.value)}
                onSave={() => setNome(tempNome)}
            />
            <CampoEdicao
                label="Bio"
                valor={tempBio}
                onChange={(e) => setTempBio(e.target.value)}
                onSave={() => setBio(tempBio)}
            />
        </div>
    )
}
export default Perfil