#include <napi.h>
#include <vector>
#include <unordered_map>
#include <string>
#include <sstream>
#include <cmath>
#include <numeric>
#include <functional> // Для std::hash
#include <fstream>
#include <iostream> // Для отладки

class LogisticRegression : public Napi::ObjectWrap<LogisticRegression> {
public:
    static Napi::Object Init(Napi::Env env, Napi::Object exports);
    LogisticRegression(const Napi::CallbackInfo& info);

private:
    Napi::Value Train(const Napi::CallbackInfo& info);
    Napi::Value Classify(const Napi::CallbackInfo& info);
    Napi::Value LoadModel(const Napi::CallbackInfo& info);
    Napi::Value SaveModel(const Napi::CallbackInfo& info);
    double Sigmoid(double z);
    double CalculateLoss(const std::vector<std::vector<double>>& inputs, const std::vector<int>& labels);
    std::vector<double> HashingVectorize(const std::string& text, size_t numFeatures);

    std::vector<double> weights;
    std::unordered_map<std::string, size_t> featureDict; // Словарь для хранения признаков
    double learningRate = 0.01;
    int iterations = 1000;
    size_t numFeatures = 1000; // Количество признаков
};

Napi::Object LogisticRegression::Init(Napi::Env env, Napi::Object exports) {
    Napi::Function func = DefineClass(env, "LogisticRegression", {
        InstanceMethod("train", &LogisticRegression::Train),
        InstanceMethod("classify", &LogisticRegression::Classify),
        InstanceMethod("loadModel", &LogisticRegression::LoadModel),
        InstanceMethod("saveModel", &LogisticRegression::SaveModel),
        });

    exports.Set(Napi::String::New(env, "LogisticRegression"), func);
    return exports;
}

LogisticRegression::LogisticRegression(const Napi::CallbackInfo& info)
    : Napi::ObjectWrap<LogisticRegression>(info) {
    if (info.Length() > 0 && info[0].IsObject()) {
        Napi::Object options = info[0].As<Napi::Object>();
        if (options.Has("learningRate")) {
            learningRate = options.Get("learningRate").As<Napi::Number>().DoubleValue();
        }
        if (options.Has("iterations")) {
            iterations = options.Get("iterations").As<Napi::Number>().Int32Value();
        }
        if (options.Has("numFeatures")) {
            numFeatures = options.Get("numFeatures").As<Napi::Number>().Uint32Value();
        }
    }
}

std::vector<double> LogisticRegression::HashingVectorize(const std::string& text, size_t numFeatures) {
    std::vector<double> vector(numFeatures, 0.0);
    std::hash<std::string> hasher;

    std::istringstream stream(text);
    std::string token;

    while (stream >> token) {
        size_t hashIndex = hasher(token) % numFeatures;
        if (featureDict.find(token) == featureDict.end()) {
            featureDict[token] = hashIndex; // Добавляем новый признак в словарь
        }
        vector[featureDict[token]] += 1.0; // Увеличиваем значение признака
    }

    return vector;
}

double LogisticRegression::Sigmoid(double z) {
    // Обработка переполнения
    if (z < -709) return 0.0; // возвращаем 0, если значение слишком низкое
    if (z > 709) return 1.0;  // возвращаем 1, если значение слишком высокое
    return 1.0 / (1.0 + std::exp(-z));
}

double LogisticRegression::CalculateLoss(const std::vector<std::vector<double>>& inputs, const std::vector<int>& labels) {
    double loss = 0.0;
    const double epsilon = 1e-10; // Маленькое значение для предотвращения логарифма нуля

    for (size_t i = 0; i < inputs.size(); i++) {
        double prediction = Sigmoid(std::inner_product(inputs[i].begin(), inputs[i].end(), weights.begin(), 0.0));

        // Избегаем переполнения и числовых ошибок, используя epsilon
        prediction = std::max(std::min(prediction, 1.0 - epsilon), epsilon);

        // Расчет потерь
        loss += -labels[i] * std::log(prediction) - (1 - labels[i]) * std::log(1 - prediction);
    }

    return loss / inputs.size();
}

Napi::Value LogisticRegression::Train(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 2 || !info[0].IsArray() || !info[1].IsArray()) {
        Napi::TypeError::New(env, "Expected two arrays").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    Napi::Array inputArray = info[0].As<Napi::Array>();
    Napi::Array labelArray = info[1].As<Napi::Array>();

    std::vector<std::vector<double>> inputs;
    std::vector<int> labels;

    for (size_t i = 0; i < inputArray.Length(); i++) {
        std::string doc = inputArray.Get(i).As<Napi::String>().Utf8Value();
        inputs.push_back(HashingVectorize(doc, numFeatures));
        labels.push_back(labelArray.Get(i).As<Napi::Number>().Int32Value());
    }

    // Проверка на размер входных данных
    if (inputs.size() == 0 || inputs[0].size() != numFeatures) {
        Napi::Error::New(env, "Input data size does not match the expected number of features").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    weights = std::vector<double>(numFeatures, 0.0);

    for (int iter = 0; iter < iterations; iter++) {
        for (size_t i = 0; i < inputs.size(); i++) {
            double prediction = Sigmoid(std::inner_product(inputs[i].begin(), inputs[i].end(), weights.begin(), 0.0));
            double error = labels[i] - prediction;
            for (size_t j = 0; j < weights.size(); j++) {
                weights[j] += learningRate * error * inputs[i][j];
            }
        }

        // Дополнительное логирование для отслеживания прогресса
        if (iter % 100 == 0) {
            double loss = CalculateLoss(inputs, labels);
            std::cout << "Iteration: " << iter << " Loss: " << loss << std::endl;
        }
    }

    return env.Undefined();
}

Napi::Value LogisticRegression::Classify(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsString()) {
        Napi::TypeError::New(env, "Expected a string").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    std::string input = info[0].As<Napi::String>().Utf8Value();
    std::vector<double> vector = HashingVectorize(input, numFeatures);

    if (vector.size() != weights.size()) {
        Napi::Error::New(env, "Input vector size does not match weights size").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    double z = std::inner_product(vector.begin(), vector.end(), weights.begin(), 0.0);
    double probability = Sigmoid(z);

    return Napi::Number::New(env, probability);
}

Napi::Value LogisticRegression::SaveModel(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsString()) {
        Napi::TypeError::New(env, "Expected a string").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    std::string filename = info[0].As<Napi::String>();
    std::ofstream file(filename, std::ios::binary);
    if (!file.is_open()) {
        Napi::Error::New(env, "Unable to open file for writing").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    // Сохраняем размеры и сами веса
    size_t weightsSize = weights.size();
    file.write(reinterpret_cast<const char*>(&weightsSize), sizeof(weightsSize));
    file.write(reinterpret_cast<const char*>(weights.data()), weightsSize * sizeof(double));

    // Сохраняем размер словаря и его содержимое
    size_t dictSize = featureDict.size();
    file.write(reinterpret_cast<const char*>(&dictSize), sizeof(dictSize));
    for (const auto& pair : featureDict) {
        size_t keySize = pair.first.size();
        file.write(reinterpret_cast<const char*>(&keySize), sizeof(keySize));
        file.write(pair.first.data(), keySize);
        file.write(reinterpret_cast<const char*>(&pair.second), sizeof(pair.second));
    }

    file.close();
    return env.Undefined();
}

Napi::Value LogisticRegression::LoadModel(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsString()) {
        Napi::TypeError::New(env, "Expected a string").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    std::string filename = info[0].As<Napi::String>();
    std::ifstream file(filename, std::ios::binary);
    if (!file.is_open()) {
        Napi::Error::New(env, "Unable to open file for reading").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    // Загружаем размеры и сами веса
    size_t weightsSize;
    file.read(reinterpret_cast<char*>(&weightsSize), sizeof(weightsSize));
    weights.resize(weightsSize);
    file.read(reinterpret_cast<char*>(weights.data()), weightsSize * sizeof(double));

    // Загружаем размер словаря и его содержимое
    size_t dictSize;
    file.read(reinterpret_cast<char*>(&dictSize), sizeof(dictSize));
    featureDict.clear();
    for (size_t i = 0; i < dictSize; i++) {
        size_t keySize;
        file.read(reinterpret_cast<char*>(&keySize), sizeof(keySize));
        std::string key(keySize, '\0');
        file.read(&key[0], keySize);
        size_t value;
        file.read(reinterpret_cast<char*>(&value), sizeof(value));
        featureDict[key] = value;
    }

    file.close();
    return env.Undefined();
}


Napi::Object InitAll(Napi::Env env, napi_value exports) {
    Napi::Object result = Napi::Object::New(env);
    return LogisticRegression::Init(env, result);
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, InitAll)
