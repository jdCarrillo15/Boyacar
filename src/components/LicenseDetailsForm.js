import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from "../constants/colors";
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../providers/AuthProvider';
import { fetchRestrictions } from '../services/LicenseService';


export default function LicenseDetailsForm({ handleLicenseSubmit }) {
    const { profile } = useAuth()
    const [licenseNumber, setLicenseNumber] = useState('');
    const [issueDate, setIssueDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [licenseType, setLicenseType] = useState('');
    const [bloodType, setBloodType] = useState('');
    const [rh, setRh] = useState('');
    const [restriction, setRestriction] = useState('');
    const [restrictions, setRestrictions] = useState([]);
    const licenseTypes = ['A', 'B', 'C'];
    const bloodTypes = ['O', 'A', 'B', 'AB'];
    const rhOptions = ['+', '-'];


    useEffect(() => {
        const loadRestrictions = async () => {
            const { data, error } = await fetchRestrictions();
            if (error) {
                Alert.alert('Error', 'Error al cargar las restricciones del conductor');
            } else {
                setRestrictions(data);
            }
        };
        loadRestrictions()
    }, [])

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || issueDate;
        setShowDatePicker(false);
        setIssueDate(currentDate);
    };

    const handleSubmit = () => {
        if (!licenseNumber || licenseNumber.length !== 11 || issueDate >= new Date() || !licenseType || !bloodType || !rh || !restrictions) {
            Alert.alert('Error', 'Todos los campos obligatorios deben estar completos y válidos.');
            return;
        }
        handleLicenseSubmit({
            driving_license_id: licenseNumber,
            profile_id: profile.profile_id,
            issue_date: issueDate,
            license_type: licenseType,
            blood_type: bloodType,
            RH: rh,
            driver_restrictions: restriction,
        })
        Alert.alert('Éxito', 'Licencia registrada correctamente.');
    };

    return (
        <View style={styles.container} >
            <Text style={styles.title}>Información de licencia de conducción</Text>
            <TextInput
                style={styles.input}
                placeholder="Número de licencia (11 dígitos)"
                keyboardType="numeric"
                maxLength={11}
                value={licenseNumber}
                onChangeText={setLicenseNumber}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.button}>
                <Text style={styles.buttonText}>Fecha de expedición: {issueDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={issueDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    maximumDate={new Date()}
                />
            )}
            <Picker
                selectedValue={licenseType}
                style={styles.input}
                onValueChange={(itemValue) => setLicenseType(itemValue)}
            >
                <Picker.Item label="Selecciona el tipo de licencia" value="" />
                {licenseTypes.map((type) => (
                    <Picker.Item key={type} label={type} value={type} />
                ))}
            </Picker>
            <View style={styles.bloodContainer}>
                <Picker
                    selectedValue={bloodType}
                    style={styles.bloodPicker}
                    onValueChange={(itemValue) => setBloodType(itemValue)}
                >
                    <Picker.Item label="Tipo de sangre" value="" />
                    {bloodTypes.map((type) => (
                        <Picker.Item key={type} label={type} value={type} />
                    ))}
                </Picker>
                <Picker
                    selectedValue={rh}
                    style={styles.rhPicker}
                    onValueChange={(itemValue) => setRh(itemValue)}
                >
                    <Picker.Item label="RH" value="" />
                    {rhOptions.map((option) => (
                        <Picker.Item key={option} label={option} value={option} />
                    ))}
                </Picker>
            </View>
            <Picker
                selectedValue={restriction}
                style={styles.input}
                onValueChange={(itemValue) => setRestriction(itemValue)}
            >
                <Picker.Item label="Seleccionar restricción si aplica" value="" />
                {restrictions.map((res) => (
                    <Picker.Item key={res.restriction_id} label={`${res.restriction}`} value={res.restriction_id} />
                ))}
            </Picker>
            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>Guardar y continuar</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: colors.PRIMARY_COLOR,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
    bloodContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    bloodPicker: {
        flex: 2,
        marginRight: 10,
    },
    rhPicker: {
        flex: 1,
    },
});
