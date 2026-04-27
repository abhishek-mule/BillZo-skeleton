import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Step = "phone" | "otp";

const Auth = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [resend, setResend] = useState(24);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step !== "otp") return;
    const t = setInterval(() => setResend((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [step]);

  const formatPhone = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  };

  const handleSendOtp = () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      toast.error("Enter a valid 10-digit number");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      setResend(24);
      toast.success("OTP sent to +91 " + phone);
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    }, 700);
  };

  const handleOtpChange = (i: number, v: string) => {
    const digit = v.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = digit;
    setOtp(next);
    if (digit && i < 5) otpRefs.current[i + 1]?.focus();
    if (next.every((d) => d) && next.join("").length === 6) verifyOtp(next.join(""));
  };

  const handleOtpKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const data = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!data) return;
    e.preventDefault();
    const next = data.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(next);
    if (data.length === 6) verifyOtp(data);
  };

  const verifyOtp = (code: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (code === "000000") {
        setShake(true);
        setTimeout(() => setShake(false), 350);
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
        toast.error("Wrong code. Try again.");
        return;
      }
      navigate("/onboarding");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <header className="container py-5 flex items-center justify-between">
        <Logo />
        {step === "otp" && (
          <button onClick={() => setStep("phone")} className="text-sm text-muted-foreground inline-flex items-center gap-1 hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        )}
      </header>

      <div className="flex-1 grid place-items-center px-4 pb-16">
        <div className="w-full max-w-md animate-scale-in">
          {step === "phone" ? (
            <div className="rounded-2xl border border-border bg-card shadow-elegant p-7">
              <h1 className="text-2xl font-bold tracking-tight">Welcome to BillZo</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">Enter your phone to continue. We'll send an OTP.</p>

              <label className="mt-7 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone</label>
              <div className="mt-2 flex items-center gap-2 rounded-xl border-2 border-input bg-background focus-within:border-primary transition-base px-4 py-3">
                <span className="text-base font-semibold text-muted-foreground">+91</span>
                <span className="h-5 w-px bg-border" />
                <input
                  inputMode="numeric"
                  autoFocus
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="98765 43210"
                  className="flex-1 bg-transparent text-base font-medium outline-none placeholder:text-muted-foreground/50 number-display"
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                />
              </div>

              <Button variant="hero" size="xl" className="mt-6 w-full" onClick={handleSendOtp} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}
              </Button>

              <p className="mt-5 text-xs text-center text-muted-foreground">
                By continuing you agree to our <a className="underline">Terms</a> & <a className="underline">Privacy</a>.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card shadow-elegant p-7">
              <h1 className="text-2xl font-bold tracking-tight">Enter the 6-digit code</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">Sent to +91 {phone}</p>

              <div className={`mt-7 flex gap-2 justify-between ${shake ? "animate-shake" : ""}`}>
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    onPaste={handleOtpPaste}
                    className="h-14 w-12 sm:h-16 sm:w-14 text-center text-2xl font-bold rounded-xl border-2 border-input bg-background focus:border-primary focus:outline-none number-display transition-base"
                  />
                ))}
              </div>

              <div className="mt-6 text-sm text-center">
                {resend > 0 ? (
                  <span className="text-muted-foreground">Resend in {resend}s</span>
                ) : (
                  <button onClick={() => { setResend(24); toast.success("OTP resent"); }} className="text-primary font-medium hover:underline">
                    Resend code
                  </button>
                )}
              </div>

              {loading && (
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Verifying…
                </div>
              )}

              <p className="mt-5 text-xs text-center text-muted-foreground">
                Tip: enter <span className="font-mono font-semibold">000000</span> to see the error state.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
