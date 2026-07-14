const passwordInput = document.getElementById("password");
const strengthFill = document.getElementById("strengthFill");
const strengthText = document.getElementById("strengthText");
const suggestionText = document.getElementById("suggestionText");
const togglePassword = document.getElementById("togglePassword");
const generateButton = document.getElementById("generateButton");
const generatedPassword = document.getElementById("generatedPassword");
const copyButton = document.getElementById("copyButton");

const commonPasswords = [
    "password",
    "password123",
    "123456",
    "12345678",
    "qwerty",
    "admin",
    "welcome",
    "letmein"
];

passwordInput.addEventListener("input", checkPasswordStrength);

function updateRequirement(elementId, isValid) {
    const element = document.getElementById(elementId);

    if (isValid) {
        element.classList.add("valid");
        element.classList.remove("invalid");
        element.textContent = "✓ " + element.textContent.replace("✓ ", "").replace("✗ ", "");
    } else {
        element.classList.add("invalid");
        element.classList.remove("valid");
        element.textContent = "✗ " + element.textContent.replace("✓ ", "").replace("✗ ", "");
    }
}

function checkPasswordStrength() {
    const password = passwordInput.value;

    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    const hasRepeatedCharacters = /(.)\1{2,}/.test(password);
    const hasCommonPattern = commonPasswords.includes(password.toLowerCase());
    const isUnique = !hasRepeatedCharacters && !hasCommonPattern;

    updateRequirement("lengthCheck", hasLength);
    updateRequirement("uppercaseCheck", hasUppercase);
    updateRequirement("lowercaseCheck", hasLowercase);
    updateRequirement("numberCheck", hasNumber);
    updateRequirement("specialCheck", hasSpecial);
    updateRequirement("uniqueCheck", isUnique);

    let score = 0;
    const suggestions = [];

    if (hasLength) {
        score++;
    } else {
        suggestions.push("Use at least 8 characters.");
    }

    if (password.length >= 12) {
        score++;
    }

    if (hasUppercase) {
        score++;
    } else {
        suggestions.push("Add an uppercase letter.");
    }

    if (hasLowercase) {
        score++;
    } else {
        suggestions.push("Add a lowercase letter.");
    }

    if (hasNumber) {
        score++;
    } else {
        suggestions.push("Add a number.");
    }

    if (hasSpecial) {
        score++;
    } else {
        suggestions.push("Add a special character.");
    }

    if (isUnique) {
        score++;
    } else {
        suggestions.push("Avoid common passwords and repeated characters.");
    }

    displayStrength(password, score, suggestions);
}

function displayStrength(password, score, suggestions) {
    if (password.length === 0) {
        strengthText.textContent = "Strength: Not Checked";
        strengthFill.style.width = "0";
        suggestionText.textContent =
            "Enter a password to receive suggestions.";
        return;
    }

    let strength;
    let width;
    let color;

    if (score <= 2) {
        strength = "Weak";
        width = "25%";
        color = "#dc2626";
    } else if (score <= 4) {
        strength = "Medium";
        width = "50%";
        color = "#f59e0b";
    } else if (score <= 6) {
        strength = "Strong";
        width = "75%";
        color = "#16a34a";
    } else {
        strength = "Very Strong";
        width = "100%";
        color = "#15803d";
    }

    strengthText.textContent = `Strength: ${strength}`;
    strengthFill.style.width = width;
    strengthFill.style.backgroundColor = color;

    if (suggestions.length === 0) {
        suggestionText.textContent =
            "Excellent! Your password meets all security requirements.";
    } else {
        suggestionText.textContent = suggestions.join(" ");
    }
}

togglePassword.addEventListener("click", function () {
    const isHidden = passwordInput.type === "password";

    passwordInput.type = isHidden ? "text" : "password";
    togglePassword.textContent = isHidden ? "Hide" : "Show";
});

generateButton.addEventListener("click", function () {
    const strongPassword = generateStrongPassword(14);
    generatedPassword.textContent = strongPassword;
});

function generateStrongPassword(length) {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "!@#$%^&*()_+-=";

    const allCharacters =
        uppercase + lowercase + numbers + special;

    let password =
        getRandomCharacter(uppercase) +
        getRandomCharacter(lowercase) +
        getRandomCharacter(numbers) +
        getRandomCharacter(special);

    while (password.length < length) {
        password += getRandomCharacter(allCharacters);
    }

    return shufflePassword(password);
}

function getRandomCharacter(characters) {
    const randomArray = new Uint32Array(1);
    crypto.getRandomValues(randomArray);

    const index = randomArray[0] % characters.length;
    return characters[index];
}

function shufflePassword(password) {
    const characters = password.split("");

    for (let i = characters.length - 1; i > 0; i--) {
        const randomArray = new Uint32Array(1);
        crypto.getRandomValues(randomArray);

        const j = randomArray[0] % (i + 1);

        [characters[i], characters[j]] =
            [characters[j], characters[i]];
    }

    return characters.join("");
}

copyButton.addEventListener("click", async function () {
    const password = generatedPassword.textContent;

    if (!password) {
        alert("Please generate a password first.");
        return;
    }

    try {
        await navigator.clipboard.writeText(password);
        copyButton.textContent = "Copied!";

        setTimeout(() => {
            copyButton.textContent = "Copy Password";
        }, 1500);
    } catch (error) {
        alert("Unable to copy the password.");
    }
});
