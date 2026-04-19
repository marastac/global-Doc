import { useState } from 'react';

const API_URL = 'http://localhost:3000/api/mock-payment';

export const SimulationForm = () => {
  const [fullName, setFullName] = useState('');
  const [passport, setPassport] = useState('');
  const [service, setService] = useState('visa');
  const [countryCode, setCountryCode] = useState('+51');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const validatePhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.length >= 7 && digits.length <= 15;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult('Procesando solicitud…');

    // validación de número
    if (!validatePhone(phoneNumber)) {
      setPhoneError('Ingrese un número de WhatsApp válido (mínimo 7 dígitos).');
      setResult(null);
      return;
    }

    setPhoneError(null);

    const fullContact = `${countryCode}${phoneNumber.replace(/\D/g, '')}`;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          emailHash: fullContact,
          service,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setResult(`Error: ${data.error}`);
      } else {
        setResult(
          `Solicitud registrada • ID: ${data.simId} • Estado: ${data.status}`
        );
      }
    } catch (err) {
      setResult('Error de conexión.');
    }
  };

  const phoneDigits = phoneNumber.replace(/\D/g, '');
  const isPhoneValid = phoneDigits.length >= 7;

  return (
    <section id="simulacion" className="section alt">
      <h2>Registro de Solicitud</h2>
      <p className="muted">
        Complete sus datos para activar la revisión ejecutiva y asignación de
        canal prioritario.
      </p>

      <form className="form form-elevated" onSubmit={onSubmit}>
        <div className="form-row">
          <label>
            Nombre Completo
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ej. Carlos Méndez"
              required
            />
          </label>

          <label>
            Número de Pasaporte
            <input
              value={passport}
              onChange={(e) => setPassport(e.target.value)}
              placeholder="Ej. P-5412290"
              required
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            Servicio Solicitado
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
            >
              <option value="visa">Visa Americana Elite</option>
              <option value="green_card">
                Residencia / Green Card Preferencial
              </option>

              {/* NUEVO: Pasaportes/Nacionalidad (simulado / preventivo) */}
              <option value="passport_nationality">
                Pasaportes & Nacionalidad (Análisis Anti-Fraude)
              </option>

              <option value="pasaporte_eu">Pasaporte Europeo Express</option>
              <option value="licencia">Licencia Internacional Multipaís</option>
            </select>
          </label>

          <label className="phone-label">
            WhatsApp / Teléfono
            <div
              className={
                'phone-group ' +
                (phoneError
                  ? 'phone-group-error'
                  : isPhoneValid
                  ? 'phone-group-ok'
                  : '')
              }
            >
              <select
                className="country-select"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              >
                <option value="+51">🇵🇪 Perú (+51)</option>
                <option value="+1">🇺🇸 USA (+1)</option>
                <option value="+34">🇪🇸 España (+34)</option>
                <option value="+52">🇲🇽 México (+52)</option>
                <option value="+55">🇧🇷 Brasil (+55)</option>
                <option value="+44">🇬🇧 Reino Unido (+44)</option>
                <option value="+33">🇫🇷 Francia (+33)</option>
                <option value="+39">🇮🇹 Italia (+39)</option>
                <option value="+49">🇩🇪 Alemania (+49)</option>
                <option value="+61">🇦🇺 Australia (+61)</option>
              </select>

              <div className="phone-input-wrapper">
                <span className="wa-icon">📱</span>
                <input
                  className="phone-input"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPhoneNumber(value);
                    if (phoneError && validatePhone(value)) {
                      setPhoneError(null);
                    }
                  }}
                  placeholder="987654321"
                  required
                />
              </div>
            </div>

            <span
              className={
                'field-hint ' +
                (phoneError ? 'error' : isPhoneValid ? 'ok' : '')
              }
            >
              {phoneError
                ? 'Revise el número. Debe contener solo dígitos reales y al menos 7 cifras.'
                : isPhoneValid
                ? 'Formato correcto. El contacto se registra de forma encriptada en la bitácora.'
                : 'Se usará solo para notificaciones privadas dentro de esta simulación.'}
            </span>
          </label>
        </div>

        <button className="btn-primary btn-large" type="submit">
          Registrar Solicitud
        </button>
      </form>

      {result && <div className="result-box">{result}</div>}
    </section>
  );
};
